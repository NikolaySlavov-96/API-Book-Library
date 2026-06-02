import { and, asc, count, eq, ilike, inArray, like, or, type SQL, sql } from 'drizzle-orm';

import { type TDb } from '../../db';
import { products, productStatusCounts, productStatuses, users } from '../../db/schema';
import {
    type TProductStatusByEmailQuery,
    type TProductStatusByEmailResult,
    type TProductStatusByEmailRow,
    type TProductStatusCreateInput,
    type TProductStatusListQuery,
    type TProductStatusListResult,
    type TProductStatusRecord,
    type TProductStatusRepository,
    type TProductStatusWithRelations,
    type TStatusCountRow,
} from '../types';

const buildSearchPredicate = (filterOperator: string, searchContent: string): SQL => {
    const operator = filterOperator === 'iLike' ? ilike : like;
    return or(operator(products.productTitle, searchContent), operator(products.genre, searchContent));
};

export class ProductStatusRepository implements TProductStatusRepository {
    constructor(
        private readonly dbRead: TDb,
        private readonly dbWrite: TDb,
    ) {}

    async findAndCount(query: TProductStatusListQuery): Promise<TProductStatusListResult> {
        const baseConditions: SQL[] = [eq(productStatuses.userId, query.userId), eq(productStatuses.isDelete, false)];
        if (query.statusId) {
            baseConditions.push(eq(productStatuses.statusId, query.statusId));
        }

        const searchCondition = query.searchContent
            ? buildSearchPredicate(query.filterOperator, query.searchContent)
            : undefined;

        const allConditions = searchCondition ? [...baseConditions, searchCondition] : baseConditions;
        const where = and(...allConditions);

        const totalRows = await this.dbRead
            .select({ value: count() })
            .from(productStatuses)
            .innerJoin(products, eq(productStatuses.productId, products.id))
            .where(where);
        const total = Number(totalRows[0]?.value ?? 0);

        const statusRows = await this.dbRead.query.productStatuses.findMany({
            where,
            orderBy: [asc(productStatuses.id)],
            offset: query.offset,
            limit: query.limit,
            with: {
                product: {
                    with: {
                        productAuthors: { with: { author: true } },
                        productFiles: { with: { file: true } },
                    },
                },
                user: true,
                state: true,
            },
        });

        const rows: TProductStatusWithRelations[] = statusRows.map((row) => {
            const { productAuthors, productFiles, ...productFields } = row.product;
            return {
                id: row.id,
                statusId: row.statusId,
                isDelete: row.isDelete,
                product: {
                    ...productFields,
                    authors: productAuthors.map((pa) => pa.author),
                    files: productFiles.map((pf) => pf.file),
                },
                user: {
                    id: row.user.id,
                    email: row.user.email,
                    isVerify: row.user.isVerify,
                },
                state: {
                    stateName: row.state?.stateName ?? null,
                },
            };
        });

        return { count: total, rows };
    }

    async findOneActive(productId: number, userId: number): Promise<TProductStatusRecord | null> {
        const [row] = await this.dbRead
            .select()
            .from(productStatuses)
            .where(
                and(
                    eq(productStatuses.productId, productId),
                    eq(productStatuses.userId, userId),
                    eq(productStatuses.isDelete, false),
                ),
            )
            .limit(1);
        return row ?? null;
    }

    async findStatusCounts(userId: number): Promise<TStatusCountRow[]> {
        const rows = await this.dbRead
            .select({
                statusId: productStatuses.statusId,
                count: count(productStatuses.statusId),
            })
            .from(productStatuses)
            .where(and(eq(productStatuses.userId, userId), eq(productStatuses.isDelete, false)))
            .groupBy(productStatuses.statusId);

        return rows.map((row) => ({ statusId: Number(row.statusId), count: Number(row.count) }));
    }

    async incrementStatusCount(userId: number, productId: number, statusId: number): Promise<void> {
        await this.dbWrite
            .insert(productStatusCounts)
            .values({ userId, productId, statusId, count: 1 })
            .onConflictDoUpdate({
                target: [productStatusCounts.userId, productStatusCounts.productId, productStatusCounts.statusId],
                set: { count: sql`${productStatusCounts.count} + 1`, updatedAt: new Date() },
            });
    }

    async findCountsForProduct(userId: number, productId: number): Promise<TStatusCountRow[]> {
        const rows = await this.dbRead
            .select({ statusId: productStatusCounts.statusId, count: productStatusCounts.count })
            .from(productStatusCounts)
            .where(and(eq(productStatusCounts.userId, userId), eq(productStatusCounts.productId, productId)));

        return rows.map((row) => ({ statusId: Number(row.statusId), count: Number(row.count) }));
    }

    async findCountsForProducts(userId: number, productIds: number[]): Promise<Map<number, TStatusCountRow[]>> {
        const map = new Map<number, TStatusCountRow[]>();
        if (productIds.length === 0) {
            return map;
        }

        const rows = await this.dbRead
            .select({
                productId: productStatusCounts.productId,
                statusId: productStatusCounts.statusId,
                count: productStatusCounts.count,
            })
            .from(productStatusCounts)
            .where(and(eq(productStatusCounts.userId, userId), inArray(productStatusCounts.productId, productIds)));

        for (const row of rows) {
            const productId = Number(row.productId);
            const list = map.get(productId) ?? [];
            list.push({ statusId: Number(row.statusId), count: Number(row.count) });
            map.set(productId, list);
        }

        return map;
    }

    async create(input: TProductStatusCreateInput): Promise<TProductStatusRecord> {
        const [row] = await this.dbWrite.insert(productStatuses).values(input).returning();
        return row;
    }

    async updateStatusId(id: number, statusId: number): Promise<TProductStatusRecord | null> {
        const [row] = await this.dbWrite
            .update(productStatuses)
            .set({ statusId, updatedAt: new Date() })
            .where(eq(productStatuses.id, id))
            .returning();
        return row ?? null;
    }

    async markDeleted(id: number): Promise<TProductStatusRecord | null> {
        const [row] = await this.dbWrite
            .update(productStatuses)
            .set({ isDelete: true, updatedAt: new Date() })
            .where(eq(productStatuses.id, id))
            .returning();
        return row ?? null;
    }

    async findByUserEmail(query: TProductStatusByEmailQuery): Promise<TProductStatusByEmailResult> {
        const [userRow] = await this.dbRead
            .select({ id: users.id })
            .from(users)
            .where(eq(users.email, query.email))
            .limit(1);
        if (!userRow) {
            return { count: 0, rows: [] };
        }

        const where = and(eq(productStatuses.isDelete, false), eq(productStatuses.userId, userRow.id));

        const totalRows = await this.dbRead.select({ value: count() }).from(productStatuses).where(where);
        const total = Number(totalRows[0]?.value ?? 0);

        const statusRows = await this.dbRead.query.productStatuses.findMany({
            where,
            orderBy: [asc(productStatuses.id)],
            offset: query.offset,
            limit: query.limit,
            with: {
                user: { with: { profile: true } },
                product: {
                    with: {
                        productAuthors: { with: { author: true } },
                        productFiles: { with: { file: true } },
                    },
                },
            },
        });

        const rows: TProductStatusByEmailRow[] = statusRows.map((row) => {
            const { productAuthors, productFiles, ...productFields } = row.product;
            return {
                id: row.id,
                statusId: row.statusId,
                productId: row.productId,
                user: {
                    id: row.user.id,
                    email: row.user.email,
                    isVerify: row.user.isVerify,
                    profile: row.user.profile ? { year: row.user.profile.year } : null,
                },
                product: {
                    ...productFields,
                    authors: productAuthors.map((pa) => pa.author),
                    files: productFiles.map((pf) => pf.file),
                },
            };
        });

        return { count: total, rows };
    }
}

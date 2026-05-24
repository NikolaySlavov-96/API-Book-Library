import { and, asc, count, eq, ilike, like, or, type SQL } from 'drizzle-orm';

import { type TDb } from '../../db';
import { products, productStatuses, users } from '../../db/schema';
import {
    type IProductStatusByEmailQuery,
    type IProductStatusByEmailResult,
    type IProductStatusByEmailRow,
    type IProductStatusListQuery,
    type IProductStatusListResult,
    type IProductStatusRecord,
    type IProductStatusRepository,
    type IProductStatusWithRelations,
    type IStatusCountRow,
} from '../interfaces';

const toRecord = (row: typeof productStatuses.$inferSelect): IProductStatusRecord => ({
    id: row.id,
    userId: row.userId,
    productId: row.productId,
    statusId: row.statusId,
    isDelete: row.isDelete,
});

const buildSearchPredicate = (filterOperator: string, searchContent: string): SQL => {
    const operator = filterOperator === 'iLike' ? ilike : like;
    return or(operator(products.productTitle, searchContent), operator(products.genre, searchContent)) as SQL;
};

export class ProductStatusRepository implements IProductStatusRepository {
    constructor(
        private readonly dbRead: TDb,
        private readonly dbWrite: TDb,
    ) {}

    async findAndCount(query: IProductStatusListQuery): Promise<IProductStatusListResult> {
        const baseConditions: SQL[] = [
            eq(productStatuses.userId, query.userId),
            eq(productStatuses.isDelete, false),
        ];
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

        const rows: IProductStatusWithRelations[] = statusRows.map((row) => ({
            id: row.id,
            statusId: row.statusId,
            isDelete: row.isDelete,
            product: {
                id: row.product.id,
                productTitle: row.product.productTitle ?? null,
                genre: row.product.genre ?? null,
                isVerify: row.product.isVerify,
                pages: row.product.pages ?? null,
                publishedYear: row.product.publishedYear ?? null,
                description: row.product.description ?? null,
                authors: row.product.productAuthors.map((pa) => ({
                    id: pa.author.id,
                    name: pa.author.name ?? null,
                    genre: pa.author.genre ?? null,
                    isVerify: pa.author.isVerify,
                })),
                files: row.product.productFiles.map((pf) => ({
                    id: pf.file.id,
                    extension: pf.file.extension ?? null,
                    realFileName: pf.file.realFileName ?? null,
                    src: pf.file.src ?? null,
                    uniqueName: pf.file.uniqueName ?? null,
                })),
            },
            user: {
                id: row.user.id,
                email: row.user.email,
                isVerify: row.user.isVerify,
            },
            state: {
                stateName: row.state?.stateName ?? null,
            },
        }));

        return { count: total, rows };
    }

    async findOneActive(productId: number, userId: number): Promise<IProductStatusRecord | null> {
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
        return row ? toRecord(row) : null;
    }

    async findStatusCounts(userId: number): Promise<IStatusCountRow[]> {
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

    async create(input: { userId: number; productId: number; statusId: number }): Promise<IProductStatusRecord> {
        const [row] = await this.dbWrite.insert(productStatuses).values(input).returning();
        return toRecord(row);
    }

    async updateStatusId(id: number, statusId: number): Promise<IProductStatusRecord | null> {
        const [row] = await this.dbWrite
            .update(productStatuses)
            .set({ statusId, updatedAt: new Date() })
            .where(eq(productStatuses.id, id))
            .returning();
        return row ? toRecord(row) : null;
    }

    async markDeleted(id: number): Promise<IProductStatusRecord | null> {
        const [row] = await this.dbWrite
            .update(productStatuses)
            .set({ isDelete: true, updatedAt: new Date() })
            .where(eq(productStatuses.id, id))
            .returning();
        return row ? toRecord(row) : null;
    }

    async findByUserEmail(query: IProductStatusByEmailQuery): Promise<IProductStatusByEmailResult> {
        const [userRow] = await this.dbRead.select({ id: users.id }).from(users).where(eq(users.email, query.email)).limit(1);
        if (!userRow) {
            return { count: 0, rows: [] };
        }

        const where = and(eq(productStatuses.isDelete, false), eq(productStatuses.userId, userRow.id));

        const totalRows = await this.dbRead
            .select({ value: count() })
            .from(productStatuses)
            .where(where);
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

        const rows: IProductStatusByEmailRow[] = statusRows.map((row) => ({
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
                id: row.product.id,
                productTitle: row.product.productTitle ?? null,
                genre: row.product.genre ?? null,
                isVerify: row.product.isVerify,
                pages: row.product.pages ?? null,
                publishedYear: row.product.publishedYear ?? null,
                description: row.product.description ?? null,
                authors: row.product.productAuthors.map((pa) => ({
                    id: pa.author.id,
                    name: pa.author.name ?? null,
                    genre: pa.author.genre ?? null,
                    isVerify: pa.author.isVerify,
                })),
                files: row.product.productFiles.map((pf) => ({
                    id: pf.file.id,
                    extension: pf.file.extension ?? null,
                    realFileName: pf.file.realFileName ?? null,
                    src: pf.file.src ?? null,
                    uniqueName: pf.file.uniqueName ?? null,
                })),
            },
        }));

        return { count: total, rows };
    }
}

import { and, asc, count, eq, ilike, like, or, type SQL, sql } from 'drizzle-orm';

import { type TDb } from '../../db';
import { products } from '../../db/schema';
import {
    type IProductCreateInput,
    type IProductListQuery,
    type IProductListResult,
    type IProductRecord,
    type IProductRepository,
    type IProductWithRelations,
} from '../interfaces';

const buildSearchPredicate = (filterOperator: string, searchContent: string): SQL => {
    const operator = filterOperator === 'iLike' ? ilike : like;
    return or(operator(products.productTitle, searchContent), operator(products.genre, searchContent)) as SQL;
};

const toRecord = (row: typeof products.$inferSelect): IProductRecord => ({
    id: row.id,
    productTitle: row.productTitle ?? null,
    genre: row.genre ?? null,
    isVerify: row.isVerify,
    pages: row.pages ?? null,
    publishedYear: row.publishedYear ?? null,
    description: row.description ?? null,
});

export class ProductRepository implements IProductRepository {
    constructor(
        private readonly dbRead: TDb,
        private readonly dbWrite: TDb,
    ) {}

    async findAndCount(query: IProductListQuery): Promise<IProductListResult> {
        const conditions: SQL[] = [];
        if (query.searchContent) {
            conditions.push(buildSearchPredicate(query.filterOperator, query.searchContent));
        }
        const where = conditions.length ? and(...conditions) : undefined;

        const totalRows = await this.dbRead
            .select({ value: count() })
            .from(products)
            .where(where);
        const total = Number(totalRows[0]?.value ?? 0);

        const productRows = await this.dbRead.query.products.findMany({
            where,
            orderBy: [asc(products.id)],
            offset: query.offset,
            limit: query.limit,
            with: {
                productAuthors: {
                    with: { author: true },
                },
                productFiles: {
                    with: { file: true },
                },
                productStatuses: query.userId
                    ? {
                          where: (productStatusesTable, { eq: equals, and: allOf }) => {
                              const filters = [
                                  equals(productStatusesTable.userId, query.userId as number),
                                  equals(productStatusesTable.isDelete, false),
                              ];
                              if (query.statusId) {
                                  filters.push(equals(productStatusesTable.statusId, query.statusId));
                              }
                              return allOf(...filters);
                          },
                          columns: { statusId: true },
                      }
                    : undefined,
            },
        });

        const filteredRows = query.statusId && query.userId
            ? productRows.filter((row) => (row.productStatuses?.length ?? 0) > 0)
            : productRows;

        const rows: IProductWithRelations[] = filteredRows.map((row) => ({
            ...toRecord(row),
            authors: row.productAuthors.map((pa) => ({
                id: pa.author.id,
                name: pa.author.name ?? null,
                genre: pa.author.genre ?? null,
                isVerify: pa.author.isVerify,
            })),
            files: row.productFiles.map((pf) => ({
                id: pf.file.id,
                extension: pf.file.extension ?? null,
                realFileName: pf.file.realFileName ?? null,
                src: pf.file.src ?? null,
                uniqueName: pf.file.uniqueName ?? null,
            })),
            userStatusId: row.productStatuses?.[0]?.statusId ?? null,
        }));

        return { count: total, rows };
    }

    async findById(id: number): Promise<IProductWithRelations | null> {
        const row = await this.dbRead.query.products.findFirst({
            where: eq(products.id, id),
            with: {
                productAuthors: { with: { author: true } },
                productFiles: { with: { file: true } },
            },
        });

        if (!row) {
            return null;
        }

        return {
            ...toRecord(row),
            authors: row.productAuthors.map((pa) => ({
                id: pa.author.id,
                name: pa.author.name ?? null,
                genre: pa.author.genre ?? null,
                isVerify: pa.author.isVerify,
            })),
            files: row.productFiles.map((pf) => ({
                id: pf.file.id,
                extension: pf.file.extension ?? null,
                realFileName: pf.file.realFileName ?? null,
                src: pf.file.src ?? null,
                uniqueName: pf.file.uniqueName ?? null,
            })),
            userStatusId: null,
        };
    }

    async findByTitleCaseInsensitive(title: string): Promise<IProductRecord | null> {
        const [row] = await this.dbRead
            .select()
            .from(products)
            .where(sql`lower(${products.productTitle}) = lower(${title})`)
            .limit(1);
        return row ? toRecord(row) : null;
    }

    async create(input: IProductCreateInput): Promise<IProductRecord> {
        const [row] = await this.dbWrite
            .insert(products)
            .values({
                productTitle: input.productTitle,
                genre: input.genre ?? null,
                pages: input.pages ?? null,
                publishedYear: input.publishedYear ?? null,
                description: input.description ?? null,
            })
            .returning();
        return toRecord(row);
    }
}

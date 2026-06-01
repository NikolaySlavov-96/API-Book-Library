import { and, asc, count, eq, ilike, inArray, like, or, type SQL, sql } from 'drizzle-orm';

import { type TDb } from '../../db';
import { authors, productAuthors as productAuthorsTable, products } from '../../db/schema';
import {
    type TProductCreateInput,
    type TProductListQuery,
    type TProductListResult,
    type TProductRecord,
    type TProductRepository,
    type TProductWithRelations,
} from '../types';

const buildSearchPredicate = (db: TDb, filterOperator: string, searchContent: string): SQL => {
    const operator = filterOperator === 'iLike' ? ilike : like;
    const productsByAuthor = db
        .select({ id: productAuthorsTable.productId })
        .from(productAuthorsTable)
        .innerJoin(authors, eq(authors.id, productAuthorsTable.authorId))
        .where(operator(authors.name, searchContent));

    return or(
        operator(products.productTitle, searchContent),
        operator(products.genre, searchContent),
        inArray(products.id, productsByAuthor),
    );
};

export class ProductRepository implements TProductRepository {
    constructor(
        private readonly dbRead: TDb,
        private readonly dbWrite: TDb,
    ) {}

    async findAndCount(query: TProductListQuery): Promise<TProductListResult> {
        const conditions: SQL[] = [];
        if (query.searchContent) {
            conditions.push(buildSearchPredicate(this.dbRead, query.filterOperator, query.searchContent));
        }
        const where = conditions.length ? and(...conditions) : undefined;

        const totalRows = await this.dbRead.select({ value: count() }).from(products).where(where);
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
                                  equals(productStatusesTable.userId, query.userId),
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

        const filteredRows =
            query.statusId && query.userId
                ? productRows.filter((row) => (row.productStatuses?.length ?? 0) > 0)
                : productRows;

        const rows: TProductWithRelations[] = filteredRows.map((row) => {
            const { productAuthors, productFiles, productStatuses, ...productFields } = row;
            return {
                ...productFields,
                authors: productAuthors.map((pa) => pa.author),
                files: productFiles.map((pf) => pf.file),
                userStatusId: productStatuses?.[0]?.statusId ?? null,
            };
        });

        return { count: total, rows };
    }

    async findById(id: number): Promise<TProductWithRelations | null> {
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

        const { productAuthors, productFiles, ...productFields } = row;
        return {
            ...productFields,
            authors: productAuthors.map((pa) => pa.author),
            files: productFiles.map((pf) => pf.file),
            userStatusId: null,
        };
    }

    async findByTitleCaseInsensitive(title: string): Promise<TProductRecord | null> {
        const [row] = await this.dbRead
            .select()
            .from(products)
            .where(sql`lower(${products.productTitle}) = lower(${title})`)
            .limit(1);
        return row ?? null;
    }

    async create(input: TProductCreateInput): Promise<TProductRecord> {
        const [row] = await this.dbWrite
            .insert(products)
            .values({
                productTitle: input.productTitle,
                genre: input.genre ?? null,
                pages: input.pages ?? null,
                publishedYear: input.publishedYear ?? null,
                description: input.description ?? null,
                ...(input.authorsSeparator ? { authorsSeparator: input.authorsSeparator } : {}),
            })
            .returning();
        return row;
    }
}

import { type TProductRow } from '../../db/schema';

import { type IAuthorRecord } from './IAuthorRepository';
import { type IFileRecord } from './IFileRepository';

export type IProductRecord = TProductRow;

export interface IProductWithRelations extends IProductRecord {
    authors: IAuthorRecord[];
    files: IFileRecord[];
    userStatusId: number | null;
}

export type IProductCreateInput = Pick<TProductRow, 'productTitle'> &
    Partial<Pick<TProductRow, 'genre' | 'pages' | 'publishedYear' | 'description' | 'authorsSeparator'>>;

export interface IProductListQuery {
    offset: number;
    limit: number;
    filterOperator: string;
    searchContent?: string;
    statusId?: number | null;
    userId?: number | null;
}

export interface IProductListResult {
    count: number;
    rows: IProductWithRelations[];
}

export interface IProductRepository {
    findAndCount(query: IProductListQuery): Promise<IProductListResult>;
    findById(id: number): Promise<IProductWithRelations | null>;
    findByTitleCaseInsensitive(title: string): Promise<IProductRecord | null>;
    create(input: IProductCreateInput): Promise<IProductRecord>;
}

import { type IAuthorRecord } from './IAuthorRepository';
import { type IFileRecord } from './IFileRepository';

export interface IProductRecord {
    id: number;
    productTitle: string | null;
    genre: string | null;
    isVerify: boolean;
    pages: number | null;
    publishedYear: number | null;
    description: string | null;
}

export interface IProductWithRelations extends IProductRecord {
    authors: IAuthorRecord[];
    files: IFileRecord[];
    userStatusId: number | null;
}

export interface IProductCreateInput {
    productTitle: string;
    genre?: string | null;
    pages?: number | null;
    publishedYear?: number | null;
    description?: string | null;
}

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

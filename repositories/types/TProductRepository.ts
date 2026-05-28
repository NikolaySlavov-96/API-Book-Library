import { type TProductRow } from '../../db/schema';

import { type TAuthorRecord } from './TAuthorRepository';
import { type TFileRecord } from './TFileRepository';

export type TProductRecord = TProductRow;

export type TProductWithRelations = TProductRecord & {
    authors: TAuthorRecord[];
    files: TFileRecord[];
    userStatusId: number | null;
};

export type TProductCreateInput = Pick<TProductRow, 'productTitle'> &
    Partial<Pick<TProductRow, 'genre' | 'pages' | 'publishedYear' | 'description' | 'authorsSeparator'>>;

export type TProductListQuery = {
    offset: number;
    limit: number;
    filterOperator: string;
    searchContent?: string;
    statusId?: number | null;
    userId?: number | null;
};

export type TProductListResult = {
    count: number;
    rows: TProductWithRelations[];
};

export type TProductRepository = {
    findAndCount(query: TProductListQuery): Promise<TProductListResult>;
    findById(id: number): Promise<TProductWithRelations | null>;
    findByTitleCaseInsensitive(title: string): Promise<TProductRecord | null>;
    create(input: TProductCreateInput): Promise<TProductRecord>;
};

import { type TProductStatusRow } from '../../db/schema';

import { type TAuthorRecord } from './TAuthorRepository';
import { type TFileRecord } from './TFileRepository';
import { type TProductRecord } from './TProductRepository';

export type TProductStatusRecord = TProductStatusRow;

export type TProductStatusCreateInput = Pick<TProductStatusRow, 'userId' | 'productId' | 'statusId'>;

export type TProductWithAuthorsAndFiles = TProductRecord & {
    authors: TAuthorRecord[];
    files: TFileRecord[];
};

export type TProductStatusUserRef = {
    id: number;
    email: string;
    isVerify: boolean;
    profile?: { year: number } | null;
};

export type TProductStatusStateRef = {
    stateName: string | null;
};

export type TProductStatusWithRelations = {
    id: number;
    statusId: number;
    isDelete: boolean;
    product: TProductWithAuthorsAndFiles;
    user: TProductStatusUserRef;
    state: TProductStatusStateRef;
};

export type TProductStatusListQuery = {
    statusId: number | null;
    userId: number;
    offset: number;
    limit: number;
    filterOperator: string;
    searchContent?: string;
};

export type TProductStatusListResult = {
    count: number;
    rows: TProductStatusWithRelations[];
};

export type TProductStatusByEmailQuery = {
    email: string;
    offset: number;
    limit: number;
};

export type TProductStatusByEmailRow = {
    id: number;
    statusId: number;
    productId: number;
    user: TProductStatusUserRef;
    product: TProductWithAuthorsAndFiles;
};

export type TProductStatusByEmailResult = {
    count: number;
    rows: TProductStatusByEmailRow[];
};

export type TStatusCountRow = {
    statusId: number;
    count: number;
};

export type TStatusHistoryRow = {
    statusId: number;
    createdAt: Date;
};

export type TProductStatusRepository = {
    findAndCount(query: TProductStatusListQuery): Promise<TProductStatusListResult>;
    findOneActive(productId: number, userId: number): Promise<TProductStatusRecord | null>;
    findStatusCounts(userId: number): Promise<TStatusCountRow[]>;
    create(input: TProductStatusCreateInput): Promise<TProductStatusRecord>;
    updateStatusId(id: number, statusId: number): Promise<TProductStatusRecord | null>;
    markDeleted(id: number): Promise<TProductStatusRecord | null>;
    findByUserEmail(query: TProductStatusByEmailQuery): Promise<TProductStatusByEmailResult>;
    addStatusHistory(userId: number, productId: number, statusId: number): Promise<void>;
    findHistoryForProducts(userId: number, productIds: number[]): Promise<Map<number, TStatusHistoryRow[]>>;
    findHistoryForProduct(userId: number, productId: number): Promise<TStatusHistoryRow[]>;
};

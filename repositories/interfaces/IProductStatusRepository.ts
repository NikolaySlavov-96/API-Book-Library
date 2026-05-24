import { type IAuthorRecord } from './IAuthorRepository';
import { type IFileRecord } from './IFileRepository';
import { type IProductRecord } from './IProductRepository';

export interface IProductStatusRecord {
    id: number;
    userId: number;
    productId: number;
    statusId: number;
    isDelete: boolean;
}

export interface IProductWithAuthorsAndFiles extends IProductRecord {
    authors: IAuthorRecord[];
    files: IFileRecord[];
}

export interface IProductStatusUserRef {
    id: number;
    email: string;
    isVerify: boolean;
    profile?: { year: number } | null;
}

export interface IProductStatusStateRef {
    stateName: string | null;
}

export interface IProductStatusWithRelations {
    id: number;
    statusId: number;
    isDelete: boolean;
    product: IProductWithAuthorsAndFiles;
    user: IProductStatusUserRef;
    state: IProductStatusStateRef;
}

export interface IProductStatusListQuery {
    statusId: number | null;
    userId: number;
    offset: number;
    limit: number;
    filterOperator: string;
    searchContent?: string;
}

export interface IProductStatusListResult {
    count: number;
    rows: IProductStatusWithRelations[];
}

export interface IProductStatusByEmailQuery {
    email: string;
    offset: number;
    limit: number;
}

export interface IProductStatusByEmailRow {
    id: number;
    statusId: number;
    productId: number;
    user: IProductStatusUserRef;
    product: IProductWithAuthorsAndFiles;
}

export interface IProductStatusByEmailResult {
    count: number;
    rows: IProductStatusByEmailRow[];
}

export interface IStatusCountRow {
    statusId: number;
    count: number;
}

export interface IProductStatusRepository {
    findAndCount(query: IProductStatusListQuery): Promise<IProductStatusListResult>;
    findOneActive(productId: number, userId: number): Promise<IProductStatusRecord | null>;
    findStatusCounts(userId: number): Promise<IStatusCountRow[]>;
    create(input: { userId: number; productId: number; statusId: number }): Promise<IProductStatusRecord>;
    updateStatusId(id: number, statusId: number): Promise<IProductStatusRecord | null>;
    markDeleted(id: number): Promise<IProductStatusRecord | null>;
    findByUserEmail(query: IProductStatusByEmailQuery): Promise<IProductStatusByEmailResult>;
}

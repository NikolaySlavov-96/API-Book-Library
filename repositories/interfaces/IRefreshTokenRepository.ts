export interface IRefreshTokenRecord {
    token: string;
    userId: string;
    expireAt: number;
    unit: string;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface IRefreshTokenCreateInput {
    token: string;
    userId: string;
    expireAt: number;
    unit: string;
}

export interface IRefreshTokenRepository {
    findByToken(token: string): Promise<IRefreshTokenRecord | null>;
    create(input: IRefreshTokenCreateInput): Promise<IRefreshTokenRecord>;
    markUsed(token: string): Promise<void>;
}

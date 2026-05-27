export type TRefreshTokenRecord = {
    token: string;
    userId: string;
    expireAt: number;
    unit: string;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
};

export type TRefreshTokenCreateInput = {
    token: string;
    userId: string;
    expireAt: number;
    unit: string;
};

export type TRefreshTokenRepository = {
    findByToken(token: string): Promise<TRefreshTokenRecord | null>;
    create(input: TRefreshTokenCreateInput): Promise<TRefreshTokenRecord>;
    markUsed(token: string): Promise<void>;
};

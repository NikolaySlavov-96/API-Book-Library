export type TVerifyTokenRecord = {
    token: string;
    address: string;
    expireAt: number;
    unit: string;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
};

export type TVerifyTokenCreateInput = {
    token: string;
    address: string;
    expireAt: number;
    unit: string;
};

export type TVerifyTokenRepository = {
    findByToken(token: string): Promise<TVerifyTokenRecord | null>;
    create(input: TVerifyTokenCreateInput): Promise<TVerifyTokenRecord>;
    markUsed(token: string): Promise<TVerifyTokenRecord | null>;
};

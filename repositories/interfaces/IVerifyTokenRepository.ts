export interface IVerifyTokenRecord {
    token: string;
    address: string;
    expireAt: number;
    unit: string;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface IVerifyTokenCreateInput {
    token: string;
    address: string;
    expireAt: number;
    unit: string;
}

export interface IVerifyTokenRepository {
    findByToken(token: string): Promise<IVerifyTokenRecord | null>;
    create(input: IVerifyTokenCreateInput): Promise<IVerifyTokenRecord>;
    markUsed(token: string): Promise<IVerifyTokenRecord | null>;
}

export interface IUserRecord {
    id: number;
    email: string;
    password: string | null;
    isVerify: boolean;
    isDelete: boolean;
    role: string;
}

export interface IUserCreateInput {
    email: string;
    password: string | null;
}

export interface IUserRepository {
    findById(id: number | string): Promise<IUserRecord | null>;
    findByEmail(email: string): Promise<IUserRecord | null>;
    countByEmail(email: string): Promise<number>;
    create(input: IUserCreateInput): Promise<IUserRecord>;
    markVerified(id: number): Promise<void>;
}

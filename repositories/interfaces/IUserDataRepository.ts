export interface IUserDataRecord {
    userAddress: string;
}

export interface IUserDataRepository {
    findByAddress(userAddress: string): Promise<IUserDataRecord | null>;
    create(input: IUserDataRecord): Promise<IUserDataRecord>;
    countAll(): Promise<number>;
}

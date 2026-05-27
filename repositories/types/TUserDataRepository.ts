export type TUserDataRecord = {
    userAddress: string;
};

export type TUserDataRepository = {
    findByAddress(userAddress: string): Promise<TUserDataRecord | null>;
    create(input: TUserDataRecord): Promise<TUserDataRecord>;
    countAll(): Promise<number>;
};

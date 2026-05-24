export interface IMessageStatusRecord {
    messageId: number;
    status: string;
}

export interface IMessageStatusRepository {
    create(input: IMessageStatusRecord): Promise<IMessageStatusRecord>;
}

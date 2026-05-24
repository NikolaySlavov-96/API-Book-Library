export interface IMessageRecord {
    id: number;
    roomName: string;
    senderId: string;
    message: string | null;
    isDelete: boolean;
}

export interface IMessageCreateInput {
    roomName: string;
    senderId: string;
    message: string;
}

export interface IMessageRepository {
    create(input: IMessageCreateInput): Promise<IMessageRecord>;
}

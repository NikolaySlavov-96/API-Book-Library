export interface IMessageAttributes {
    id: number;
    roomName: string;
    senderId: string;
    message: string;
    isDelete: boolean;
}

export interface IMessageStatusAttributes {
    messageId: string;
    status: string;
}
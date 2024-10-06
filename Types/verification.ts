export interface IPayload {
    _id: string;
    email: string;
    year: number;
    isVerify: boolean;
    connectId?: string;
}

export interface ICondition {
    type: string,
    security: string
}
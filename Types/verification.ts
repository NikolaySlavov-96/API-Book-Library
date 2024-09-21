export interface IPayload {
    _id: string;
    email: string;
    year: number;
    isVerify: boolean;
}

export interface ICondition {
    type: string,
    security: string
}
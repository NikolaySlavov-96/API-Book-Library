export interface IPayload {
    _id: string;
    email: string;
    year: number;
    isVerify: boolean;
    role: 'user' | 'support';
    connectId?: string;
}

export interface ICondition {
    type: string,
    security: string
}
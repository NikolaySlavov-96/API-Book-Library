export interface IPayload {
    _id: string;
    email: string;
    isVerify: boolean;
    role: 'user' | 'support';
}

export interface ICondition {
    type: string,
    security: string
}
export interface IPayload {
    _id: string;
    email: string;
    year: number;
}

export interface ICondition {
    type: string,
    security: string
}
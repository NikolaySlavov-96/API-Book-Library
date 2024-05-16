export interface IPayload {
    _id: string;
    email: string;
    year: number;
    organisation?: string;
}

export interface ICondition {
    type: string,
    security: string
}
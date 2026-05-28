import { type EUserRole } from '../constants';

export interface IPayload {
    _id: string;
    email: string;
    isVerify: boolean;
    role: EUserRole;
}

export interface ICondition {
    type: string;
    security: string;
}

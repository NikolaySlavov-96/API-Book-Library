import { Document, Schema, model, } from 'mongoose';

import ModelName from './modelNames';

interface IVerifyToken extends Document {
    token: string;
    address: string;
    expireAt: number;
    unit: string;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const VerifyTokenSchema = new Schema<IVerifyToken>({
    token: { type: String, },
    address: { type: String, },
    expireAt: { type: Number, },
    unit: { type: String, },
    status: { type: Boolean, default: false, },
}, { timestamps: true, });

export default model<IVerifyToken>(ModelName.VERIFY_TOKEN, VerifyTokenSchema);
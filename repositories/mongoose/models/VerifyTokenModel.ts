import { type Document, model, Schema } from 'mongoose';

export interface IVerifyTokenDocument extends Document {
    token: string;
    address: string;
    expireAt: number;
    unit: string;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const VerifyTokenSchema = new Schema<IVerifyTokenDocument>(
    {
        token: { type: String },
        address: { type: String },
        expireAt: { type: Number },
        unit: { type: String },
        status: { type: Boolean, default: false },
    },
    { timestamps: true },
);

export const VerifyTokenModel = model<IVerifyTokenDocument>('verifyToken', VerifyTokenSchema);

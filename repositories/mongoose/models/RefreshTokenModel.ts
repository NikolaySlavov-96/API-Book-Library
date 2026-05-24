import { type Document, model, Schema } from 'mongoose';

export interface IRefreshTokenDocument extends Document {
    token: string;
    userId: string;
    expireAt: number;
    unit: string;
    status: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const RefreshTokenSchema = new Schema<IRefreshTokenDocument>(
    {
        token: { type: String, index: true },
        userId: { type: String },
        expireAt: { type: Number },
        unit: { type: String },
        status: { type: Boolean, default: false },
    },
    { timestamps: true },
);

export const RefreshTokenModel = model<IRefreshTokenDocument>('refreshToken', RefreshTokenSchema);

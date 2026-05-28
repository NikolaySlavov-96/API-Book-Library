import { type Document, model, Schema } from 'mongoose';

import { SECONDS_IN_WEEK } from '../../../constants';

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

// TTL cleanup: refresh tokens are valid for REFRESH_TOKEN_TTL (7 days), so Mongo
// auto-purges each row 7 days after creation instead of letting them pile up.
// The authoritative expiry check still lives in refreshTokenService.
RefreshTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: SECONDS_IN_WEEK });

export const RefreshTokenModel = model<IRefreshTokenDocument>('refreshToken', RefreshTokenSchema);

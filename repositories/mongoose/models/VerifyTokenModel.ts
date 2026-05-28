import { type Document, model, Schema } from 'mongoose';

import { SECONDS_IN_HOUR } from '../../../constants';

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

// TTL cleanup: verify/magic tokens are valid for 15 minutes. Keep rows for 1h
// (well past expiry) purely so Mongo can purge them; the real expiry check is
// in tokenService.verifyEmailToken.
VerifyTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: SECONDS_IN_HOUR });

export const VerifyTokenModel = model<IVerifyTokenDocument>('verifyToken', VerifyTokenSchema);

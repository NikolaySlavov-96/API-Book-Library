import { model, Schema } from 'mongoose';

import ModelName from './modelNames';
import { type IRefreshToken } from './ModelsInterfaces';

const RefreshTokenSchema = new Schema<IRefreshToken>(
    {
        token: { type: String, index: true },
        userId: { type: String },
        expireAt: { type: Number },
        unit: { type: String },
        status: { type: Boolean, default: false },
    },
    { timestamps: true },
);

export default model<IRefreshToken>(ModelName.REFRESH_TOKEN, RefreshTokenSchema);

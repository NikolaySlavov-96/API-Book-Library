import { Schema, model, } from 'mongoose';

import ModelName from './modelNames';

import { IVerifyToken, } from './ModelsInterfaces';


const VerifyTokenSchema = new Schema<IVerifyToken>({
    token: { type: String, },
    address: { type: String, },
    expireAt: { type: Number, },
    unit: { type: String, },
    status: { type: Boolean, default: false, },
}, { timestamps: true, });

export default model<IVerifyToken>(ModelName.VERIFY_TOKEN, VerifyTokenSchema);
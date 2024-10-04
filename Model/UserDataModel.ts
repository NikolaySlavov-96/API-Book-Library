import { Schema, model, } from 'mongoose';

import ModelName from './modelNames';

interface IUserData {
    userAddress: string;
}

const userDataSchema = new Schema<IUserData>({
    userAddress: { type: String, },
});

export default model<IUserData>(ModelName.USER_DATA, userDataSchema);
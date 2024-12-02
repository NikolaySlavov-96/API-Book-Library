import { Schema, model, } from 'mongoose';

import ModelName from './modelNames';

import { IUserData, } from './ModelsInterfaces';


const userDataSchema = new Schema<IUserData>({
    userAddress: { type: String, },
});

export default model<IUserData>(ModelName.USER_DATA, userDataSchema);
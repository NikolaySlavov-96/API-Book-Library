import { model, Schema } from 'mongoose';

import ModelName from './modelNames';
import { type IUserData } from './ModelsInterfaces';

const userDataSchema = new Schema<IUserData>({
    userAddress: { type: String },
});

export default model<IUserData>(ModelName.USER_DATA, userDataSchema);

import { type Document, model, Schema } from 'mongoose';

export interface IUserDataDocument extends Document {
    userAddress: string;
}

const UserDataSchema = new Schema<IUserDataDocument>({
    userAddress: { type: String },
});

export const UserDataModel = model<IUserDataDocument>('userData', UserDataSchema);

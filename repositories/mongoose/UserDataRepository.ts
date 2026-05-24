import { type IUserDataRecord, type IUserDataRepository } from '../interfaces';

import { UserDataModel } from './models/UserDataModel';

export class UserDataRepository implements IUserDataRepository {
    async findByAddress(userAddress: string): Promise<IUserDataRecord | null> {
        const doc = await UserDataModel.findOne({ userAddress });
        return doc ? { userAddress: doc.userAddress } : null;
    }

    async create(input: IUserDataRecord): Promise<IUserDataRecord> {
        const doc = await UserDataModel.create(input);
        return { userAddress: doc.userAddress };
    }

    async countAll(): Promise<number> {
        return UserDataModel.countDocuments();
    }
}

import { type TUserDataRecord, type TUserDataRepository } from '../types';

import { UserDataModel } from './models/UserDataModel';

export class UserDataRepository implements TUserDataRepository {
    async findByAddress(userAddress: string): Promise<TUserDataRecord | null> {
        const doc = await UserDataModel.findOne({ userAddress });
        return doc ? { userAddress: doc.userAddress } : null;
    }

    async create(input: TUserDataRecord): Promise<TUserDataRecord> {
        const doc = await UserDataModel.create(input);
        return { userAddress: doc.userAddress };
    }

    async countAll(): Promise<number> {
        return UserDataModel.countDocuments();
    }
}

import { type IRefreshTokenCreateInput, type IRefreshTokenRecord, type IRefreshTokenRepository } from '../interfaces';

import { type IRefreshTokenDocument, RefreshTokenModel } from './models/RefreshTokenModel';

const toRecord = (doc: IRefreshTokenDocument): IRefreshTokenRecord => ({
    token: doc.token,
    userId: doc.userId,
    expireAt: doc.expireAt,
    unit: doc.unit,
    status: doc.status,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
});

export class RefreshTokenRepository implements IRefreshTokenRepository {
    async findByToken(token: string): Promise<IRefreshTokenRecord | null> {
        const doc = await RefreshTokenModel.findOne({ token });
        return doc ? toRecord(doc) : null;
    }

    async create(input: IRefreshTokenCreateInput): Promise<IRefreshTokenRecord> {
        const doc = await RefreshTokenModel.create(input);
        return toRecord(doc);
    }

    async markUsed(token: string): Promise<void> {
        await RefreshTokenModel.updateOne({ token }, { status: true });
    }
}

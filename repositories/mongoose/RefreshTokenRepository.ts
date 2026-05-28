import { type TRefreshTokenCreateInput, type TRefreshTokenRecord, type TRefreshTokenRepository } from '../types';

import { type IRefreshTokenDocument, RefreshTokenModel } from './models/RefreshTokenModel';

const toRecord = (doc: IRefreshTokenDocument): TRefreshTokenRecord => ({
    token: doc.token,
    userId: doc.userId,
    expireAt: doc.expireAt,
    unit: doc.unit,
    status: doc.status,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
});

export class RefreshTokenRepository implements TRefreshTokenRepository {
    async findByToken(token: string): Promise<TRefreshTokenRecord | null> {
        const doc = await RefreshTokenModel.findOne({ token });
        return doc ? toRecord(doc) : null;
    }

    async create(input: TRefreshTokenCreateInput): Promise<TRefreshTokenRecord> {
        const doc = await RefreshTokenModel.create(input);
        return toRecord(doc);
    }

    async markUsed(token: string): Promise<void> {
        await RefreshTokenModel.updateOne({ token }, { status: true });
    }
}

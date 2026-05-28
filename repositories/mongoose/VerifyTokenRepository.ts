import { type TVerifyTokenCreateInput, type TVerifyTokenRecord, type TVerifyTokenRepository } from '../types';

import { type IVerifyTokenDocument, VerifyTokenModel } from './models/VerifyTokenModel';

const toRecord = (doc: IVerifyTokenDocument): TVerifyTokenRecord => ({
    token: doc.token,
    address: doc.address,
    expireAt: doc.expireAt,
    unit: doc.unit,
    status: doc.status,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
});

export class VerifyTokenRepository implements TVerifyTokenRepository {
    async findByToken(token: string): Promise<TVerifyTokenRecord | null> {
        const doc = await VerifyTokenModel.findOne({ token });
        return doc ? toRecord(doc) : null;
    }

    async create(input: TVerifyTokenCreateInput): Promise<TVerifyTokenRecord> {
        const doc = await VerifyTokenModel.create(input);
        return toRecord(doc);
    }

    async markUsed(token: string): Promise<TVerifyTokenRecord | null> {
        const doc = await VerifyTokenModel.findOneAndUpdate({ token }, { status: true }, { new: true });
        return doc ? toRecord(doc) : null;
    }
}

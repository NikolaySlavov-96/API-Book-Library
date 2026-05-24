import { type IVerifyTokenCreateInput, type IVerifyTokenRecord, type IVerifyTokenRepository } from '../interfaces';

import { type IVerifyTokenDocument, VerifyTokenModel } from './models/VerifyTokenModel';

const toRecord = (doc: IVerifyTokenDocument): IVerifyTokenRecord => ({
    token: doc.token,
    address: doc.address,
    expireAt: doc.expireAt,
    unit: doc.unit,
    status: doc.status,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
});

export class VerifyTokenRepository implements IVerifyTokenRepository {
    async findByToken(token: string): Promise<IVerifyTokenRecord | null> {
        const doc = await VerifyTokenModel.findOne({ token });
        return doc ? toRecord(doc) : null;
    }

    async create(input: IVerifyTokenCreateInput): Promise<IVerifyTokenRecord> {
        const doc = await VerifyTokenModel.create(input);
        return toRecord(doc);
    }

    async markUsed(token: string): Promise<IVerifyTokenRecord | null> {
        const doc = await VerifyTokenModel.findOneAndUpdate({ token }, { status: true }, { new: true });
        return doc ? toRecord(doc) : null;
    }
}

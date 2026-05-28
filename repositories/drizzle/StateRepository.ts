import { type TDb } from '../../db';
import { states } from '../../db/schema';
import { type TStateRecord, type TStateRepository } from '../types';

export class StateRepository implements TStateRepository {
    constructor(private readonly dbRead: TDb) {}

    async findAll(): Promise<TStateRecord[]> {
        return this.dbRead.select().from(states);
    }
}

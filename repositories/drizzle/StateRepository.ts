import { type TDb } from '../../db';
import { states } from '../../db/schema';
import { type IStateRecord, type IStateRepository } from '../interfaces';

export class StateRepository implements IStateRepository {
    constructor(private readonly dbRead: TDb) {}

    async findAll(): Promise<IStateRecord[]> {
        return this.dbRead.select().from(states);
    }
}

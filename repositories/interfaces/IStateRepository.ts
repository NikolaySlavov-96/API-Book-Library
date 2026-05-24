import { type TStateRow } from '../../db/schema';

export type IStateRecord = TStateRow;

export interface IStateRepository {
    findAll(): Promise<IStateRecord[]>;
}

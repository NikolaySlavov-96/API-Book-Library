import { type TStateRow } from '../../db/schema';

export type TStateRecord = TStateRow;

export type TStateRepository = {
    findAll(): Promise<TStateRecord[]>;
};

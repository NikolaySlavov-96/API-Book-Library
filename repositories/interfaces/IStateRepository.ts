export interface IStateRecord {
    id: number;
    stateName: string;
    symbol: string | null;
}

export interface IStateRepository {
    findAll(): Promise<IStateRecord[]>;
}

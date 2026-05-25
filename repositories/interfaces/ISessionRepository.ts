import { type TSessionRow } from '../../db/schema';

export type ISessionRecord = TSessionRow;

export type ISessionCreateInput = Pick<TSessionRow, 'connectId' | 'connectedAt' | 'userId'>;

export type ISessionUpdateInput = Partial<Pick<TSessionRow, 'userId' | 'connectedAt' | 'disconnectedAt'>>;

export interface ISessionRepository {
    create(input: ISessionCreateInput): Promise<ISessionRecord>;
    updateByConnectId(connectId: string, input: ISessionUpdateInput): Promise<void>;
}

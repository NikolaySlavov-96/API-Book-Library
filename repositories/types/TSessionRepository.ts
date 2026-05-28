import { type TSessionRow } from '../../db/schema';

export type TSessionRecord = TSessionRow;

export type TSessionCreateInput = Pick<TSessionRow, 'connectId' | 'connectedAt' | 'userId'>;

export type TSessionUpdateInput = Partial<Pick<TSessionRow, 'userId' | 'connectedAt' | 'disconnectedAt'>>;

export type TSessionRepository = {
    create(input: TSessionCreateInput): Promise<TSessionRecord>;
    updateByConnectId(connectId: string, input: TSessionUpdateInput): Promise<void>;
};

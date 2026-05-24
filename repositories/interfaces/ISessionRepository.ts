import { type TSessionRow } from '../../db/schema';

export type ISessionRecord = TSessionRow;

export interface ISessionUserRef {
    id: number;
    role: string;
    email: string;
}

export interface ISessionWithUser extends ISessionRecord {
    user: ISessionUserRef | null;
}

export type ISessionCreateInput = Pick<TSessionRow, 'connectId' | 'connectedAt' | 'userId'>;

export type ISessionUpdateInput = Partial<Pick<TSessionRow, 'userId' | 'connectedAt' | 'disconnectedAt'>>;

export interface ISessionRepository {
    create(input: ISessionCreateInput): Promise<ISessionRecord>;
    updateByConnectId(connectId: string, input: ISessionUpdateInput): Promise<void>;
    findByConnectIdWithUser(connectId: string): Promise<ISessionWithUser | null>;
}

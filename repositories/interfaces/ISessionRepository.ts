export interface ISessionRecord {
    id: number;
    connectId: string | null;
    userId: number | null;
    connectedAt: string | null;
    disconnectedAt: string | null;
}

export interface ISessionUserRef {
    id: number;
    role: string;
    email: string;
}

export interface ISessionWithUser extends ISessionRecord {
    user: ISessionUserRef | null;
}

export interface ISessionCreateInput {
    connectId: string;
    connectedAt: string;
    userId: number | null;
}

export interface ISessionUpdateInput {
    userId?: number | null;
    connectedAt?: string;
    disconnectedAt?: string;
}

export interface ISessionRepository {
    create(input: ISessionCreateInput): Promise<ISessionRecord>;
    updateByConnectId(connectId: string, input: ISessionUpdateInput): Promise<void>;
    findByConnectIdWithUser(connectId: string): Promise<ISessionWithUser | null>;
}

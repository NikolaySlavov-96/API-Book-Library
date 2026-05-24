export interface IProfileRecord {
    id: number;
    userId: number;
    year: number;
    readingGoal: number;
    displayName: string | null;
    avatarFileId: number | null;
    notifyByEmail: boolean;
}

export interface IProfileAvatar {
    id: number;
    src: string | null;
    uniqueName: string | null;
}

export interface IProfileWithAvatar extends IProfileRecord {
    avatar: IProfileAvatar | null;
}

export interface IProfileCreateInput {
    userId: number;
    year: number;
}

export interface IProfileUpdateInput {
    readingGoal?: number;
    displayName?: string | null;
    avatarFileId?: number | null;
    notifyByEmail?: boolean;
}

export interface IProfileRepository {
    create(input: IProfileCreateInput): Promise<IProfileRecord>;
    findByUserId(userId: number): Promise<IProfileRecord | null>;
    findByUserIdWithAvatar(userId: number): Promise<IProfileWithAvatar | null>;
    updateByUserId(userId: number, input: IProfileUpdateInput): Promise<IProfileRecord | null>;
}

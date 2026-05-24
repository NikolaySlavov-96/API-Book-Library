import { type TProfileRow } from '../../db/schema';

export type IProfileRecord = TProfileRow;

export interface IProfileAvatar {
    id: number;
    src: string | null;
    uniqueName: string | null;
}

export interface IProfileWithAvatar extends IProfileRecord {
    avatar: IProfileAvatar | null;
}

export type IProfileCreateInput = Pick<TProfileRow, 'userId' | 'year'>;

export type IProfileUpdateInput = Partial<
    Pick<TProfileRow, 'readingGoal' | 'displayName' | 'avatarFileId' | 'notifyByEmail'>
>;

export interface IProfileRepository {
    create(input: IProfileCreateInput): Promise<IProfileRecord>;
    findByUserId(userId: number): Promise<IProfileRecord | null>;
    findByUserIdWithAvatar(userId: number): Promise<IProfileWithAvatar | null>;
    updateByUserId(userId: number, input: IProfileUpdateInput): Promise<IProfileRecord | null>;
}

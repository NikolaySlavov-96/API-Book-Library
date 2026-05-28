import { type TProfileRow } from '../../db/schema';

export type TProfileRecord = TProfileRow;

export type TProfileAvatar = {
    id: number;
    src: string | null;
    uniqueName: string | null;
};

export type TProfileWithAvatar = TProfileRecord & {
    avatar: TProfileAvatar | null;
};

export type TProfileCreateInput = Pick<TProfileRow, 'userId' | 'year'>;

export type TProfileUpdateInput = Partial<
    Pick<TProfileRow, 'readingGoal' | 'displayName' | 'avatarFileId' | 'notifyByEmail'>
>;

export type TProfileRepository = {
    create(input: TProfileCreateInput): Promise<TProfileRecord>;
    findByUserId(userId: number): Promise<TProfileRecord | null>;
    findByUserIdWithAvatar(userId: number): Promise<TProfileWithAvatar | null>;
    updateByUserId(userId: number, input: TProfileUpdateInput): Promise<TProfileRecord | null>;
};

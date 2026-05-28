import { type TUserRow } from '../../db/schema';

export type TUserRecord = TUserRow;

export type TUserCreateInput = Pick<TUserRow, 'email' | 'password'>;

export type TUserRepository = {
    findById(id: number | string): Promise<TUserRecord | null>;
    findByEmail(email: string): Promise<TUserRecord | null>;
    countByEmail(email: string): Promise<number>;
    create(input: TUserCreateInput): Promise<TUserRecord>;
    markVerified(id: number): Promise<void>;
};

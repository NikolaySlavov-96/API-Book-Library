import { type TUserRow } from '../../db/schema';

export type IUserRecord = TUserRow;

export type IUserCreateInput = Pick<TUserRow, 'email' | 'password'>;

export interface IUserRepository {
    findById(id: number | string): Promise<IUserRecord | null>;
    findByEmail(email: string): Promise<IUserRecord | null>;
    countByEmail(email: string): Promise<number>;
    create(input: IUserCreateInput): Promise<IUserRecord>;
    markVerified(id: number): Promise<void>;
}

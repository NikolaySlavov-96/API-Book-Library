import { localJwtProvider } from './LocalJwtProvider';

export const authProvider = localJwtProvider;

export type { IAuthIdentity, IAuthProvider, TVerifyResult } from './AuthProvider';

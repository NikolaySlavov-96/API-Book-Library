import { localJwtProvider, } from './LocalJwtProvider';

// === Single swap point for the whole authentication layer ===
// To move to an external provider, replace the line below with the new adapter.
export const authProvider = localJwtProvider;

export type { IAuthProvider, IAuthIdentity, TVerifyResult, } from './AuthProvider';

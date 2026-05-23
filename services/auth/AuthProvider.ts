// Authentication port.
//
// This is the ONLY contract the rest of the API depends on for "who is this
// request". Swapping the local JWT implementation for an external provider
// (Auth0 / Clerk / Supabase / Cognito ...) means writing one new adapter that
// satisfies this interface and pointing `authProvider` (see ./index.ts) at it.
// No controller, route or domain service needs to change.

export interface IAuthIdentity {
    _id: string;
    email: string;
    isVerify: boolean;
    role: string;
}

export type TVerifyResult = IAuthIdentity | { error: unknown };

export interface IAuthProvider {
    // Verify a bearer access token and return the normalized identity claims,
    // or `{ error }` when the token is missing/invalid/expired.
    verifyAccessToken(token: string): Promise<TVerifyResult>;
}

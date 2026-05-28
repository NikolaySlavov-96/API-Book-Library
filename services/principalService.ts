import { type EUserRole } from '../constants';
import { verifyToken } from '../util';

export type Principal = string;

export interface PrincipalInfo {
    principal: Principal;
    userId: number | null;
    role: EUserRole | null;
    email: string | null;
    tokenExp: number | null;
    isAnonymous: boolean;
}

const PRINCIPAL_ROOM_PREFIX = 'principal:';

export const principalRoom = (p: Principal): string => `${PRINCIPAL_ROOM_PREFIX}${p}`;

const isValidClientId = (value: unknown): value is string => {
    return typeof value === 'string' && /^[A-Za-z0-9_-]{8,128}$/.test(value);
};

// TODO(lint): type `handshake.auth` shape (token + clientId) instead of `any` (no-explicit-any).
export const derivePrincipal = (handshake: { auth?: any }): PrincipalInfo | null => {
    const auth = handshake?.auth ?? {};
    const { token } = auth;
    const { clientId } = auth;

    if (typeof token === 'string' && token.length > 0) {
        const result = verifyToken(token);
        if (result && '_id' in result) {
            return {
                principal: `user:${result._id}`,
                userId: Number(result._id),
                role: result.role,
                email: result.email,
                // TODO(lint): extend the IVerifyToken type with optional `exp` to drop these `any` casts (no-explicit-any).
                tokenExp: typeof (result as any).exp === 'number' ? (result as any).exp : null,
                isAnonymous: false,
            };
        }
    }

    if (isValidClientId(clientId)) {
        return {
            principal: `anon:${clientId}`,
            userId: null,
            role: null,
            email: null,
            tokenExp: null,
            isAnonymous: true,
        };
    }

    return null;
};

export const isTokenExpired = (tokenExp: number | null): boolean => {
    if (tokenExp === null) return false;
    return Math.floor(Date.now() / 1000) >= tokenExp;
};

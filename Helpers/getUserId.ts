// Single accessor for the authenticated identity key.
// Everything downstream treats it as an opaque value, so when identity moves to
// a provider (numeric id -> string `sub`) only the token mapping changes here.
export const _getUserId = (req) => req?.user?._id;

// Normalized auth context derived purely from the verified token claims.
// No DB hit: authorization decisions read what the auth layer already vouched for.
export const _getAuthContext = (req) => {
    const user = req?.user;
    if (!user) {
        return null;
    }

    return {
        id: user._id,
        email: user.email,
        isVerify: !!user.isVerify,
        role: user.role,
    };
};

import bcrypt from 'bcrypt';
const { compare, hash } = bcrypt;

const SOULT = 10;

// TODO(lint): drop `async` since the body returns a promise directly without `await` (require-await).
export const _cryptCompare = async (password, dbPassword) => {
    return compare(password, dbPassword);
};

export const _cryptHash = (password) => {
    return hash(password, SOULT);
};

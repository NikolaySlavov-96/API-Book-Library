import { compare, hash, } from 'bcrypt';

const SOULT = 10;

export const _cryptCompare = async (password, dbPassword) => {
    return compare(password, dbPassword);
};

export const _cryptHash = (password) => {
    return hash(password, SOULT);
};
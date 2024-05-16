// @ts-nocheck
import { database, } from '../config';

const User = database?.userModel;

export const verify = async (db, data) => {
    const obj = {
        'user': ({ id, isVerify, }) => User.findOne({ where: { id, isVerify, }, attributes: ['isVerify'], }),
    };

    return await obj[db](data);
};
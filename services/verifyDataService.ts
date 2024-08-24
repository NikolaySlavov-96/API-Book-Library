import { db, } from '../util';

import { TABLE_NAME, } from '../constants';


export const verify = async ({ id, isVerify, }) => {
    const result = await db(TABLE_NAME.USER).findOne({ where: { id, isVerify, }, attributes: ['isVerify'], });

    return result;
};
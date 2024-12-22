import db from '../Model';

const ATTRIBUTES = ['isVerify', 'role'];

export const getUserVerificationStatus = async (id) => {
    const result = (await db.User.findOne({ where: { id, isVerify: true, }, attributes: ATTRIBUTES, }))?.dataValues;

    return result;
};
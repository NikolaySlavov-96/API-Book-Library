import db from '../Model';

export const getUserVerificationStatus = async (id) => {
    const result = (await db.User.findOne({ where: { id, isVerify: true, }, attributes: ['isVerify'], }))?.dataValues;

    return result;
};
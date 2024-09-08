import db from '../Model';

const _checkUserProfileVerification = async (id) => {
    const result = (await db.User.findOne({ where: { id, isVerify: true, }, attributes: ['isVerify'], }))?.dataValues;

    return result;
};

export default _checkUserProfileVerification;
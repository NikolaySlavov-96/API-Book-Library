import db from "../Model";

export const verify = async ({ id, isVerify, }) => {
    const result = (await db.User.findOne({ where: { id, isVerify, }, attributes: ['isVerify'], }))?.dataValues;

    return result;
};
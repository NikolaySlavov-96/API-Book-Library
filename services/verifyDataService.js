// const { User } = require("../Model/UserModel");
const { db } = require('../config/database');
const User = db.userModel;

const verify = async (db, data) => {
    const obj = {
        'user': ({ id, isVerify }) => User.findOne({ where: { id, isVerify }, attributes: ['isVerify'] }),
    };

    return await obj[db](data)
}

module.exports = {
    verify,
}
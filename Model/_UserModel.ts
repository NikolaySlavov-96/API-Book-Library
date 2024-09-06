import { DataTypes } from "sequelize";

import { database as sequelize } from "../config";
console.log("🚀 ~ sequelize:", sequelize)
const User = sequelize.define('user', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    email: {
        type: DataTypes.STRING(80),
        unique: true,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING(60),
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    isVerify: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    isDelete: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
});

export default User;
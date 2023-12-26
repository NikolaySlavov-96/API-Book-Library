const { DataTypes, Op } = require('sequelize');
const { sequelize } = require('../config/database');

const User = sequelize.define("user", {
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
    isDelete: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
});

sequelize.sync().then(() => {
    console.log('User table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});

module.exports = {
    sequelize,
    Op,
    User,
}
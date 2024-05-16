export default (sequelize, { DataTypes, }) => {
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

    return User;
};
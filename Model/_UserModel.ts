import { DataTypes, Model, Optional, Sequelize, } from 'sequelize';

import ModelName from './modelNames';

import { IUserAttributes, } from './ModelsInterfaces';

interface IUserCreationAttributes extends Optional<IUserAttributes, 'id'> { }


class User extends Model<IUserAttributes, IUserCreationAttributes> implements IUserAttributes {
    declare id: number;
    declare email: string;
    declare isDelete: boolean;
    declare isVerify: boolean;
    declare password: string;
    declare year: number;
    declare role: string;
    declare readingGoal: number;
    declare displayName: string;
    declare avatarFileId: number;
    declare notifyByEmail: boolean;
}

export const UserFactory = (sequelize: Sequelize): typeof User => {
    User.init({
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
        role: {
            type: DataTypes.STRING(20),
            defaultValue: 'user',
        },
        readingGoal: {
            type: DataTypes.INTEGER,
            defaultValue: 12,
        },
        displayName: {
            type: DataTypes.STRING(60),
            allowNull: true,
        },
        avatarFileId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        notifyByEmail: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    }, {
        sequelize,
        tableName: ModelName.USER,
    });

    return User;
};
import { DataTypes, Model, Optional, Sequelize, } from 'sequelize';

import ModelName from './modelNames';

interface IUserAttributes {
    id: number;
    email: string;
    isDelete: boolean;
    isVerify: boolean;
    password: string;
    year: number;
    role: string;
}

interface IUserCreationAttributes extends Optional<IUserAttributes, 'id'> { }


export class User extends Model<IUserAttributes, IUserCreationAttributes> implements IUserAttributes {
    declare id: number;
    declare email: string;
    declare isDelete: boolean;
    declare isVerify: boolean;
    declare password: string;
    declare year: number;
    declare role: string;
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
    }, {
        sequelize,
        tableName: ModelName.USER,
    });

    return User;
};
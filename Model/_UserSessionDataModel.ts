import { DataTypes, Model, Optional, Sequelize, } from 'sequelize';

import ModelName from './modelNames';

interface IUserSessionDataAttributes {
    id: number;
    connectId: string;
    currentSocketId: string;
    userStatus: string;
    userId: number;
}

interface IUserSessionDataCreationAttributes extends Optional<IUserSessionDataAttributes, 'id'> { }


export class UserSessionData extends Model<IUserSessionDataAttributes, IUserSessionDataCreationAttributes>
    implements IUserSessionDataAttributes {
    declare id: number;
    declare connectId: string;
    declare currentSocketId: string;
    declare userStatus: string;
    declare userId: number;
}

export const UserSessionDataFactory = (sequelize: Sequelize): typeof UserSessionData => {
    UserSessionData.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        connectId: {
            type: DataTypes.STRING(50),
        },
        currentSocketId: {
            type: DataTypes.STRING(20),
        },
        userStatus: {
            type: DataTypes.STRING(12),
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    }, {
        sequelize,
        tableName: ModelName.USER_SESSION_DATA,
        timestamps: true,
    });

    return UserSessionData;
};
import { DataTypes, Model, Optional, Sequelize, } from 'sequelize';

import ModelName from './modelNames';

import { IMessageAttributes, } from './ModelsInterfaces';

interface IMessageCreationAttributes extends Optional<IMessageAttributes, 'id'> { }

class Message extends Model<IMessageAttributes, IMessageCreationAttributes> implements IMessageAttributes {
    declare id: number;
    declare roomName: string;
    declare senderId: string;
    declare message: string;
    declare isDelete: boolean;
}

export const MessageFactory = (sequelize: Sequelize): typeof Message => {
    Message.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        roomName: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        senderId: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        message: {
            type: DataTypes.STRING(255),
        },
        isDelete: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    }, {
        sequelize,
        tableName: ModelName.MESSAGE,
    });

    return Message;
};
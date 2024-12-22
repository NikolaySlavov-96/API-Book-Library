import { DataTypes, Model, Sequelize, } from 'sequelize';

import ModelName from './modelNames';

import { IMessageStatusAttributes, } from './ModelsInterfaces';

class MessageStatus extends Model<IMessageStatusAttributes> implements IMessageStatusAttributes {
    declare messageId: string;
    declare status: string;
}

export const MessageStatusFactory = (sequelize: Sequelize): typeof MessageStatus => {
    MessageStatus.init({
        messageId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
        },
        status: {
            type: DataTypes.STRING(20),
            allowNull: false,
            primaryKey: true,
        },
    }, {
        sequelize,
        tableName: ModelName.MESSAGE_STATUS,
    });

    return MessageStatus;
};
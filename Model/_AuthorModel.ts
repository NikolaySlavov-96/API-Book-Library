import { DataTypes, Model, Sequelize, } from 'sequelize';

import ModelName from './modelNames';

import { IAuthorAttributes, } from './ModelsInterfaces';

class Author extends Model<IAuthorAttributes> implements IAuthorAttributes {
    declare id: number;
    name!: string;
    genre: string;
    declare isVerify: boolean;
}


export const AuthorFactory = (sequelize: Sequelize): typeof Author => {
    Author.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(60),
            // require: true,
        },
        genre: {
            type: DataTypes.STRING(45),
        },
        isVerify: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    }, {
        sequelize,
        tableName: ModelName.AUTHOR,
    });
    return Author;
};
import { DataTypes, Model, type Optional, type Sequelize } from 'sequelize';

import ModelName from './modelNames';
import { type IAuthorFileAttributes } from './ModelsInterfaces';

type AuthorFileCreationAttributes = Optional<IAuthorFileAttributes, 'id'>;

class AuthorFile extends Model<IAuthorFileAttributes, AuthorFileCreationAttributes> implements IAuthorFileAttributes {
    declare id: number;
    declare authorId: number;
    declare fileId: number;
}

export const AuthorFileFactory = (sequelize: Sequelize): typeof AuthorFile => {
    AuthorFile.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            authorId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            fileId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: ModelName.AUTHOR_FILE,
            timestamps: false,
            indexes: [
                {
                    unique: true,
                    fields: ['authorId', 'fileId'],
                },
            ],
        },
    );

    return AuthorFile;
};

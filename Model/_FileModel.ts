import { DataTypes, Model, Optional, Sequelize, } from 'sequelize';

import ModelName from './modelNames';

interface IFileAttributes {
    id: number;
    uniqueName: string;
    src: string; // Desire user name
    extension: string;
}

interface IFileCreationAttributes extends Optional<IFileAttributes, 'id'> { }

export class File extends Model<IFileAttributes, IFileCreationAttributes> implements IFileAttributes {
    declare id: number;
    uniqueName: string;
    src: string;
    extension: string;
}

export const FileFactory = (sequelize: Sequelize): typeof File => {
    File.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        uniqueName: {
            type: DataTypes.STRING(145),
        },
        src: {
            type: DataTypes.STRING(45),
        },
        extension: {
            type: DataTypes.STRING(45),
        },
    }, {
        sequelize,
        tableName: ModelName.FILE,
    }
    );

    return File;
};
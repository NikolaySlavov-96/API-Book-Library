import { DataTypes, Model, Optional, Sequelize, } from 'sequelize';

import ModelName from './modelNames';

interface IFileAttributes {
    id: number;
    extension: string;
    realFileName: string;
    src: string; // Desire user name
    uniqueName: string;
}

interface IFileCreationAttributes extends Optional<IFileAttributes, 'id'> { }

export class File extends Model<IFileAttributes, IFileCreationAttributes> implements IFileAttributes {
    declare id: number;
    extension: string;
    realFileName: string;
    src: string;
    uniqueName: string;
}

export const FileFactory = (sequelize: Sequelize): typeof File => {
    File.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        extension: {
            type: DataTypes.STRING(10),
        },
        realFileName: {
            type: DataTypes.STRING(60),
        },
        src: {
            type: DataTypes.STRING(120),
        },
        uniqueName: {
            type: DataTypes.STRING(145),
        },
    }, {
        sequelize,
        tableName: ModelName.FILE,
    }
    );

    return File;
};
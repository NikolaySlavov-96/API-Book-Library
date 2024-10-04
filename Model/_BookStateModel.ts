import { DataTypes, Model, Optional, Sequelize, } from 'sequelize';

import ModelName from './modelNames';

interface IBookStateAttributes {
    userId: number;
    bookId: number;
    stateId: number;
    isDelete: boolean;
}

interface IBookStateCreationAttributes extends Optional<IBookStateAttributes, 'stateId'> { }
// eslint-disable-next-line max-len
export class BookState extends Model<IBookStateAttributes, IBookStateCreationAttributes> implements IBookStateAttributes {
    userId: number;
    bookId: number;
    declare stateId: number;
    declare isDelete: boolean;
}

export const BookStateFactory = (sequelize: Sequelize): typeof BookState => {
    BookState.init({
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        bookId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        stateId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        isDelete: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    }, {
        sequelize,
        tableName: ModelName.BOOK_STATE,
        timestamps: true,
    });

    return BookState;
};
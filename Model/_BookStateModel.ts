import { DataTypes, Model, Optional, } from "sequelize";

import { EBookState } from "../Types/BookEnum";

interface IBookStateAttributes {
    userId: number;
    bookId: number;
    bookState: string;
    isDelete: boolean;
}

interface IBookStateCreationAttributes extends Optional<IBookStateAttributes, 'isDelete'> { }
export class BookState extends Model<IBookStateAttributes, IBookStateCreationAttributes> implements IBookStateAttributes {
    userId!: number;
    bookId!: number;
    bookState!: string;
    isDelete!: boolean;

    // timestamps!
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const BookStateFactory = (sequelize): typeof BookState => {
    BookState.init({
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        bookId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        bookState: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        isDelete: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    }, {
        sequelize,
        tableName: 'bookState',
        timestamps: true,
    });

    return BookState;
}
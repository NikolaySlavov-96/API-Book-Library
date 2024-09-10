import { DataTypes, Model, Optional, } from 'sequelize';

// Types Book Collection Number to Type -->;
// 1: FOR_PURCHASE,
// 2: PURCHASE,
// 3: FOR_READING,
// 4: READING,
// 5: LISTENING,

interface IBookStateAttributes {
    userId: number;
    bookId: number;
    bookState: number;
    isDelete: boolean;
}

interface IBookStateCreationAttributes extends Optional<IBookStateAttributes, 'bookState'> { }
// eslint-disable-next-line max-len
export class BookState extends Model<IBookStateAttributes, IBookStateCreationAttributes> implements IBookStateAttributes {
    userId: number;
    bookId: number;
    declare bookState: number;
    declare isDelete: boolean;
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
            type: DataTypes.INTEGER,
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
};
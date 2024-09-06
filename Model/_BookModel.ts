import { DataTypes, Model, Optional } from "sequelize";

interface IBookAttributes {
    id: number;
    authorId: number;
    bookTitle: string;
    image: string;
    genre: string;
    isVerify: string;
}

interface IBookCreationAttributes extends Optional<IBookAttributes, 'id'> { }

export class Book extends Model<IBookAttributes, IBookCreationAttributes> implements IBookAttributes {
    id: number;
    authorId: number;
    bookTitle: string;
    image: string;
    genre: string;
    isVerify: string;
}

export const BookFactory = (sequelize): typeof Book => {
    Book.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        authorId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        bookTitle: {
            type: DataTypes.STRING(140),
        },
        image: {
            type: DataTypes.STRING(145),
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
        tableName: 'book',
        indexes: [
            {
                unique: true,
                name: 'usique_bookTitle',
                fields: [sequelize.fn('lower', sequelize.col('bookTitle'))],
            }
        ],
    }
    );

    return Book;
}
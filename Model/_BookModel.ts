export default (sequelize, { DataTypes, }) => {
    const Book = sequelize.define('book', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        author_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        booktitle: {
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
        indexes: [
            {
                unique: true,
                booktitle: 'unique_book',
                fields: [sequelize.fn('lower', sequelize.col('booktitle'))],
            }
        ],
    }
    );

    return Book;
};
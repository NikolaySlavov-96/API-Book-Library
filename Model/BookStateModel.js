const { DataTypes, Op } = require('sequelize');
const { sequelize } = require('../config/database');
const { Book } = require('./BookModel');
const { User } = require('./UserModel');

const BookState = sequelize.define("bookstate", {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "users",
            key: "id",
        },
        onDelete: "CASCADE"
    },
    book_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "books",
            key: "id",
        },
        onDelete: "CASCADE"
    },
    book_state: {
        type: DataTypes.ENUM,
        values: ['reading', 'forreading', 'purchase', 'forpurchase', 'listened'],
    },
    isDelete: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
});

BookState.belongsTo(Book, { foreignKey: 'book_id' });
BookState.belongsTo(User, { foreignKey: 'user_id' });

sequelize.sync().then(() => {
    console.log('BookState table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});

module.exports = {
    sequelize,
    Op,
    BookState,
}
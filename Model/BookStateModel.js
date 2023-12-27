const { DataTypes, Op } = require('sequelize');
const { sequelize } = require('../config/database');

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
        values: ['reading', 'forreading', 'purchase', 'forpurchase'],
    },
    isDelete: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
});

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
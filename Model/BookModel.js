const { DataTypes, Op } = require('sequelize');
const { sequelize } = require('../config/database');
const { Author } = require('./AuthorMode');

const Book = sequelize.define("book", {
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
        type: DataTypes.STRING(40),
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
    }
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

Book.belongsTo(Author, { foreignKey: 'author_id' });

sequelize.sync().then(() => {
    console.log('Book table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});

module.exports = {
    sequelize,
    Op,
    Book,
}
const { DataTypes, Op } = require('sequelize');
const { sequelize } = require('../config/database');

const Book = sequelize.define("book", {
    author: {
        type: DataTypes.STRING(60), // TO DO moved in new table
        unique: true,
    },
    booktitle: {
        type: DataTypes.STRING(40),
        unique: true,
    },
    image: {
        type: DataTypes.STRING(145),
    },
    genre: {
        type: DataTypes.STRING(45),
    }
});

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
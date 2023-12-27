const { DataTypes, Op } = require('sequelize');
const { sequelize } = require('../config/database');

const Book = sequelize.define("book", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    author: {
        type: DataTypes.STRING(60), // TO DO moved in new table
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
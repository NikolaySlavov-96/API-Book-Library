const { DataTypes, Op } = require('sequelize');
const { sequelize } = require('../config/database');

const Author = sequelize.define("author", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: DataTypes.STRING(60),
        require: true,
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
});


/*
sequelize.define('foo', {
    name: DataTypes.STRING,
    barId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "bars",
        key: "id"
      },
      onDelete: "CASCADE"
    },
  });
*/


sequelize.sync().then(() => {
    console.log('Author table created successfully!');
}).catch((error) => {
    console.error('Unable to create table : ', error);
});

module.exports = {
    sequelize,
    Op,
    Author,
}
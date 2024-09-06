import { DataTypes } from "sequelize";

import { database as sequelize } from "../config";

const BookState = sequelize.define('bookstate', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    book_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    book_state: {
        type: DataTypes.ENUM,
        values: ['reading', 'forreading', 'purchase', 'forpurchase', 'listened'],
    },
    isDelete: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
});

export default BookState;
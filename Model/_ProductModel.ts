import { DataTypes, Model, Optional, Sequelize, } from 'sequelize';

import ModelName from './modelNames';

import { IProductAttributes, } from './ModelsInterfaces';

interface IProductCreationAttributes extends Optional<IProductAttributes, 'id'> { }

class Product extends Model<IProductAttributes, IProductCreationAttributes> implements IProductAttributes {
    declare id: number;
    productTitle: string;
    genre: string;
    declare isVerify: string;
}

export const ProductFactory = (sequelize: Sequelize): typeof Product => {
    Product.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        productTitle: {
            type: DataTypes.STRING(140),
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
        tableName: ModelName.PRODUCT,
        indexes: [
            {
                unique: true,
                name: 'productTitle',
                fields: [sequelize.fn('lower', sequelize.col('productTitle'))],
            }
        ],
    }
    );

    return Product;
};
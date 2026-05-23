import { DataTypes, Model, type Optional, type Sequelize } from 'sequelize';

import ModelName from './modelNames';
import { type IProductAttributes } from './ModelsInterfaces';

type IProductCreationAttributes = Optional<IProductAttributes, 'id'>;

class Product extends Model<IProductAttributes, IProductCreationAttributes> implements IProductAttributes {
    declare id: number;
    productTitle: string;
    genre: string;
    declare isVerify: string;
    declare pages: number;
    declare publishedYear: number;
    declare description: string;
}

export const ProductFactory = (sequelize: Sequelize): typeof Product => {
    Product.init(
        {
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
            pages: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            publishedYear: {
                type: DataTypes.SMALLINT,
                allowNull: true,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
        },
        {
            sequelize,
            tableName: ModelName.PRODUCT,
            indexes: [
                {
                    unique: true,
                    name: 'productTitle',
                    fields: [sequelize.fn('lower', sequelize.col('productTitle'))],
                },
            ],
        },
    );

    return Product;
};

import { DataTypes, Model, Optional, Sequelize, } from 'sequelize';

import ModelName from './modelNames';

import { IProductAuthorAttributes, } from './ModelsInterfaces';

interface ProductAuthorCreationAttributes extends Optional<IProductAuthorAttributes, 'id'> { }

class ProductAuthor extends Model<IProductAuthorAttributes,
    ProductAuthorCreationAttributes> implements IProductAuthorAttributes {
    declare id: number;
    declare productId: number;
    declare authorId: number;
}

export const ProductAuthorFactory = (sequelize: Sequelize): typeof ProductAuthor => {
    ProductAuthor.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            productId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            authorId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: ModelName.PRODUCT_AUTHOR,
            timestamps: false,
            indexes: [
                {
                    unique: true,
                    fields: ['productId', 'authorId'],
                }
            ],
        }
    );

    return ProductAuthor;
};
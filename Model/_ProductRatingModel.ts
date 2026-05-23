import { DataTypes, Model, type Optional, type Sequelize } from 'sequelize';

import ModelName from './modelNames';
import { type IProductRatingAttributes } from './ModelsInterfaces';

type IProductRatingCreationAttributes = Optional<IProductRatingAttributes, 'id'>;
class ProductRating
    extends Model<IProductRatingAttributes, IProductRatingCreationAttributes>
    implements IProductRatingAttributes
{
    declare id: number;
    userId: number;
    productId: number;
    declare rating: number;
}

export const ProductRatingFactory = (sequelize: Sequelize): typeof ProductRating => {
    ProductRating.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            productId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            rating: {
                type: DataTypes.SMALLINT,
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: ModelName.PRODUCT_RATING,
            indexes: [
                {
                    unique: true,
                    name: 'productRating_user_product',
                    fields: ['userId', 'productId'],
                },
            ],
        },
    );

    return ProductRating;
};

import { DataTypes, Model, type Optional, type Sequelize } from 'sequelize';

import ModelName from './modelNames';
import { type IProductStatusAttributes } from './ModelsInterfaces';

type IProductStatusCreationAttributes = Optional<IProductStatusAttributes, 'statusId'>;

class ProductStatus
    extends Model<IProductStatusAttributes, IProductStatusCreationAttributes>
    implements IProductStatusAttributes
{
    userId: number;
    productId: number;
    declare statusId: number;
    declare isDelete: boolean;
}

export const ProductStatusFactory = (sequelize: Sequelize): typeof ProductStatus => {
    ProductStatus.init(
        {
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            productId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            statusId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            isDelete: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
            },
        },
        {
            sequelize,
            tableName: ModelName.PRODUCT_STATUS,
        },
    );

    return ProductStatus;
};

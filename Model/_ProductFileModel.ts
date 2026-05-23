import { DataTypes, Model, type Optional, type Sequelize } from 'sequelize';

import ModelName from './modelNames';
import { type IProductFileAttributes } from './ModelsInterfaces';

type ProductFileCreationAttributes = Optional<IProductFileAttributes, 'id'>;

class ProductFile
    extends Model<IProductFileAttributes, ProductFileCreationAttributes>
    implements IProductFileAttributes
{
    declare id: number;
    declare productId: number;
    declare fileId: number;
}

export const ProductFileFactory = (sequelize: Sequelize): typeof ProductFile => {
    ProductFile.init(
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
            fileId: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: ModelName.PRODUCT_FILE,
            timestamps: false,
            indexes: [
                {
                    unique: true,
                    fields: ['productId', 'fileId'],
                },
            ],
        },
    );

    return ProductFile;
};

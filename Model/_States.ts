import { DataTypes, Model, type Optional, type Sequelize } from 'sequelize';

import ModelName from './modelNames';
import { type IStateAttributes } from './ModelsInterfaces';

type IStateCreationAttributes = Optional<IStateAttributes, 'id'>;

class States extends Model<IStateAttributes, IStateCreationAttributes> implements IStateAttributes {
    declare id: number;
    stateName: string;
    symbol: string;
}

export const StateFactory = (sequelize: Sequelize): typeof States => {
    States.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            stateName: {
                type: DataTypes.STRING(80),
                unique: true,
                allowNull: false,
            },
            symbol: {
                type: DataTypes.STRING(60),
            },
        },
        {
            sequelize,
            tableName: ModelName.STATE,
            timestamps: false,
        },
    );

    return States;
};

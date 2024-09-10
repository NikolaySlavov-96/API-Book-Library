import { DataTypes, Model, Optional, Sequelize, } from 'sequelize';

interface IStateAttributes {
    id: number;
    stateName: string;
}

interface IStateCreationAttributes extends Optional<IStateAttributes, 'id'> { }


export class States extends Model<IStateAttributes, IStateCreationAttributes> implements IStateAttributes {
    declare id: number;
    stateName: string;
}

export const StateFactory = (sequelize: Sequelize): typeof States => {
    States.init({
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
    }, {
        sequelize,
        tableName: 'states',
        timestamps: false,
    });

    return States;
};
import { DataTypes, Model, type Optional, type Sequelize } from 'sequelize';

import ModelName from './modelNames';
import { type IProfileAttributes } from './ModelsInterfaces';

type IProfileCreationAttributes = Optional<IProfileAttributes, 'id'>;

// Application-owned user data, kept separate from identity/authentication.
// `userId` is the link to the identity key (today: User.id). When identity moves
// to an external provider this column becomes the provider subject, and this table
// stays exactly as the source of truth for everything the app owns about a user.
class Profile extends Model<IProfileAttributes, IProfileCreationAttributes> implements IProfileAttributes {
    declare id: number;
    declare userId: number;
    declare year: number;
    declare readingGoal: number;
    declare displayName: string;
    declare avatarFileId: number;
    declare notifyByEmail: boolean;
}

export const ProfileFactory = (sequelize: Sequelize): typeof Profile => {
    Profile.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            userId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: true,
            },
            year: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            readingGoal: {
                type: DataTypes.INTEGER,
                defaultValue: 12,
            },
            displayName: {
                type: DataTypes.STRING(60),
                allowNull: true,
            },
            avatarFileId: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            notifyByEmail: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
        },
        {
            sequelize,
            tableName: ModelName.PROFILE,
        },
    );

    return Profile;
};

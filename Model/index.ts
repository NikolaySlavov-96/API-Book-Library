import { Sequelize } from 'sequelize';

import * as ModelsInterfaces from './ModelsInterfaces';

export { ModelsInterfaces };

import { initNewConnection } from '../config';

const sequelize = initNewConnection();

import { AuthorFileFactory } from './_AuthorFileModel';
import { AuthorFactory } from './_AuthorModel';
import { FileFactory } from './_FileModel';
import { MessageFactory } from './_MessageModel';
import { MessageStatusFactory } from './_MessageStatus';
import { ProductAuthorFactory } from './_ProductAuthorModel';
import { ProductFileFactory } from './_ProductFileModel';
import { ProductFactory } from './_ProductModel';
import { ProductRatingFactory } from './_ProductRatingModel';
import { ProductStatusFactory } from './_ProductStatusModel';
import { ProfileFactory } from './_ProfileModel';
import { SessionModelFactory } from './_SessionModel';
import { StateFactory } from './_States';
import { UserFactory } from './_UserModel';

const db: any = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = UserFactory(sequelize);
db.Profile = ProfileFactory(sequelize);
db.Author = AuthorFactory(sequelize);
db.State = StateFactory(sequelize);
db.File = FileFactory(sequelize);
db.SessionModel = SessionModelFactory(sequelize);
db.Product = ProductFactory(sequelize);
db.ProductStatus = ProductStatusFactory(sequelize);
db.ProductRating = ProductRatingFactory(sequelize);
db.Message = MessageFactory(sequelize);
db.MessageStatus = MessageStatusFactory(sequelize);
db.ProductAuthor = ProductAuthorFactory(sequelize);
db.ProductFile = ProductFileFactory(sequelize);
db.AuthorFile = AuthorFileFactory(sequelize);

// Association
db.User.hasMany(db.ProductStatus, { foreignKey: 'userId' });
db.ProductStatus.belongsTo(db.User, { foreignKey: 'userId' });
db.ProductStatus.belongsTo(db.State, { foreignKey: 'statusId' });
db.ProductStatus.belongsTo(db.Product, { foreignKey: 'productId' });
db.Product.hasMany(db.ProductStatus, { foreignKey: 'productId' });

db.User.hasMany(db.ProductRating, { foreignKey: 'userId' });
db.ProductRating.belongsTo(db.User, { foreignKey: 'userId' });
db.Product.hasMany(db.ProductRating, { foreignKey: 'productId' });
db.ProductRating.belongsTo(db.Product, { foreignKey: 'productId' });

// Identity <-> Profile (one profile per identity, linked by userId)
db.User.hasOne(db.Profile, { foreignKey: 'userId', as: 'profile', constraints: false });
db.Profile.belongsTo(db.User, { foreignKey: 'userId', constraints: false });

// Avatar belongs to the profile, not to the identity
db.Profile.belongsTo(db.File, { foreignKey: 'avatarFileId', as: 'avatar', constraints: false });

db.User.hasOne(db.SessionModel, {
    foreignKey: 'userId',
    constraints: false,
});
db.SessionModel.belongsTo(db.User, {
    foreignKey: 'userId',
});
db.SessionModel.hasMany(db.Message, { foreignKey: 'senderId', sourceKey: 'connectId' });
db.MessageStatus.belongsTo(db.Message, { foreignKey: 'messageId' });

db.Product.belongsToMany(db.File, {
    through: db.ProductFile,
    foreignKey: 'productId',
    otherKey: 'fileId',
    as: 'files',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
db.File.belongsToMany(db.Product, {
    through: db.ProductFile,
    foreignKey: 'fileId',
    otherKey: 'productId',
    as: 'products',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
db.ProductFile.belongsTo(db.Product, { foreignKey: 'productId', onDelete: 'CASCADE' });
db.ProductFile.belongsTo(db.File, { foreignKey: 'fileId', onDelete: 'CASCADE' });

db.Author.belongsToMany(db.File, {
    through: db.AuthorFile,
    foreignKey: 'authorId',
    otherKey: 'fileId',
    as: 'files',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
db.File.belongsToMany(db.Author, {
    through: db.AuthorFile,
    foreignKey: 'fileId',
    otherKey: 'authorId',
    as: 'authors',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
});
db.AuthorFile.belongsTo(db.Author, { foreignKey: 'authorId', onDelete: 'CASCADE' });
db.AuthorFile.belongsTo(db.File, { foreignKey: 'fileId', onDelete: 'CASCADE' });

db.Author.belongsToMany(db.Product, {
    through: db.ProductAuthor,
    foreignKey: 'authorId',
    otherKey: 'productId',
    as: 'products',
});
db.Product.belongsToMany(db.Author, {
    through: db.ProductAuthor,
    foreignKey: 'productId',
    otherKey: 'authorId',
    as: 'authors',
});
db.Author.hasMany(db.ProductAuthor, { foreignKey: 'authorId', as: 'productAuthors' });
db.Product.hasMany(db.ProductAuthor, { foreignKey: 'productId', as: 'productAuthors' });
db.ProductAuthor.belongsTo(db.Author, { foreignKey: 'authorId', as: 'author' });
db.ProductAuthor.belongsTo(db.Product, { foreignKey: 'productId', as: 'product' });

export default db;

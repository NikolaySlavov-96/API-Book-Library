import { Sequelize, } from 'sequelize';

import { initNewConnection, } from '../config';

const sequelize = initNewConnection();

import { UserFactory, } from './_UserModel';
import { BookStateFactory, } from './_BookStateModel';
import { BookFactory, } from './_BookModel';
import { AuthorFactory, } from './_AuthorModel';
import { StateFactory, } from './_States';
import { FileFactory, } from './_FileModel';
import { UserSessionDataFactory, } from './_UserSessionDataModel';

const db: any = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = UserFactory(sequelize);
db.Book = BookFactory(sequelize);
db.Author = AuthorFactory(sequelize);
db.BookState = BookStateFactory(sequelize);
db.State = StateFactory(sequelize);
db.File = FileFactory(sequelize);
db.UserSessionData = UserSessionDataFactory(sequelize);

// Association
db.User.hasMany(db.BookState, { foreignKey: 'userId', });
db.BookState.belongsTo(db.User, { foreignKey: 'userId', });

db.User.hasOne(db.UserSessionData, {
    foreignKey: 'userId',
    constraints: false,
    // onDelete: 'CASCADE',
});
db.UserSessionData.belongsTo(db.User, {
    foreignKey: 'userId',
    // constraints: false,
});

db.Book.hasMany(db.File, {
    foreignKey: 'bookId',
});
db.File.belongsTo(db.Book, {
    foreignKey: 'bookId',
});

db.BookState.belongsTo(db.State, { foreignKey: 'stateId', });

db.Book.belongsTo(db.Author, { foreignKey: 'authorId', });
db.Author.hasMany(db.Book, { foreignKey: 'authorId', });

db.BookState.belongsTo(db.Book, { foreignKey: 'bookId', });
db.Book.hasMany(db.BookState, { foreignKey: 'bookId', });

export default db;
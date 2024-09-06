import { Sequelize } from 'sequelize';

import { initNewConnection } from '../config';

const sequelize = initNewConnection();

import { UserFactory } from './_UserModel';
import { BookStateFactory } from './_BookStateModel';
import { BookFactory } from './_BookModel';
import { AuthorFactory } from './_AuthorMode';

const db: any = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = UserFactory(sequelize);
db.Book = BookFactory(sequelize);
db.Author = AuthorFactory(sequelize);
db.BookState = BookStateFactory(sequelize);

// Book RelationShip
db.Book.belongsTo(db.Author, { foreignKey: 'authorId', });

// BookState Relationship
db.BookState.belongsTo(db.User, { foreignKey: 'userId', });
db.BookState.belongsTo(db.Book, { foreignKey: 'bookId', });

export default db;
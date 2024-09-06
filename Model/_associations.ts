import Author from './_AuthorMode';
import BookState from './_BookStateModel';
import Book from './_BookModel';
import User from './_UserModel';

const defineAssociations = () => {
    // BookState Relationship
    BookState.hasOne(User, { foreignKey: 'book_state_id', });
    BookState.belongsTo(User, { foreignKey: 'user_id', });
    BookState.belongsTo(Book, { foreignKey: 'book_id', });

    // Book RelationShip
    Book.belongsTo(Author, { foreignKey: 'author_id', });

    // Author Relationship
    Author.hasMany(Book, { foreignKey: 'author_id', });
};

export default defineAssociations;
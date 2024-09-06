// import { TABLE_NAME } from '../constants';
// import { db } from '../util';

// const User = database?.userModel;
// const Book = database?.bookModel;
// const Op = database?.Sequelize?.Op;


export const getBookByEmail = async (query) => {

};

export const searchBook = async ({ offset, limit, typeSearch, searchContent }) => {
    // TO DO Improve
    const result = []// await db(TABLE_NAME.BOOK).findAndCountAll({ offset, limit, });
    const typeOf = {
        // 'Op.like': Op.like,
    };

    // typeSearch && (query.where = {
    //     //{ authorName: { [typeOf[typeSearch]]: searchContent } } To Do creating JOIN
    //     [Op.or]: [{ booktitle: { [typeOf[typeSearch]]: searchContent, }, }, { genre: { [typeOf[typeSearch]]: searchContent, }, }],

    // });
    return result;
};
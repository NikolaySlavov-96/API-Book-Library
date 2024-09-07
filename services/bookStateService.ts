import db from "../Model";

export const getAllDate = async ({ state, userId, offset, limit, }) => {
    const response = await db.BookState.findAndCountAll({
        include: [
            {
                model: db.Book as 'book',
                required: true,
                attributes: ['id', 'bookTitle', 'image', 'genre', 'isVerify'],
                include: {
                    model: db.Author as 'author',
                    attributes: ['name', 'image', 'isVerify', 'genre'],
                },
            },
            {
                model: db.User as 'user',
                required: true,
                attributes: ['email', 'id'],
            }
        ],
        where: { bookState: state, userId, },
        attributes: ['id', 'bookState', 'isDelete'],
        order: [['id', 'ASC']],
        offset,
        limit,
        raw: true,
        nest: true,
    });

    return response;
};

export const getInfoFromBookState = async (bookId, userId) => {
    return await db.BookState.findOne({
        where: { bookId, userId, isDelete: false, },
        attributes: ['bookState'],
    });
};

export const addingNewBookState = async ({ userId, bookId, state, }) => {
    const existingBook = await db.BookState.findOne({ where: { bookId, userId, isDelete: false, }, });

    if (existingBook) {
        existingBook.dataValues.bookState = state;
        existingBook.dataValues.isDelete = true;
        return await existingBook.save();
    }

    const result = (await db.BookState.create({ userId, bookId, bookState: state, }))?.dataValues;
    return result
};
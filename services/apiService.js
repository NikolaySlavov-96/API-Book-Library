const { db } = require('../config/database');

const User = db.userModel;
const Book = db.bookModel;
const BookState = db.bookStateModel;
const Author = db.authorModel;
const Op = db.Sequelize.Op;


const getAllDate = async (query, type, search) => {
    const typeOfColletion = {
        'book': ({ offset, limit }) => Book.findAndCountAll({
            include: [{
                model: Author,
                required: false,
                attributes: ['name', 'image', 'genre', 'isVerify']
            }],
            order: [['id', 'ASC']],
            attributes: ['id', 'booktitle', 'image', 'genre', 'isVerify'],
            offset, limit
        }),
        'search': ({ offset, limit }) => Book.findAndCountAll({ offset, limit }),
        'bookState': ({ offset, limit, type, user_id }) => BookState.findAndCountAll({
            include: [{
                model: Book,
                required: true,
                attributes: ['id', 'booktitle', 'image', 'genre', 'isVerify'],
                include: {
                    model: Author,
                    attributes: ['name', 'image', 'isVerify', 'genre'],
                }
            },
            {
                model: User,
                required: true,
                attributes: ['email', 'id'],
            }],
            where: { book_state: type, user_id },
            attributes: ['id', 'book_state', 'isDelete',],
            order: [['id', 'ASC']],
            offset, limit
        }),
    }
    const typeOf = {
        'Op.like': Op.like,
    }

    type && (query.where = {
        //{ authorName: { [typeOf[type]]: search } } To Do creating JOIN
        [Op.or]: [{ booktitle: { [typeOf[type]]: search } }, { genre: { [typeOf[type]]: search } }],

    })
    return typeOfColletion[query.typesQuery](query);
}

const getDateById = async (id) => {
    return Book.findByPk(id, {
        include: [
            { model: Author, attributes: ['name', 'image', 'genre', 'isVerify'], required: false }
        ],
    })
}

const getInfoFromBookState = async (book_id, user_id) => {
    return BookState.findOne({ where: { book_id, user_id, isDelete: false }, attributes: ['book_state'] })
}

const create = async (query) => {

    const type = query.type;
    let typeInput = query.type;
    if (type === 'purchase' || type === 'forpurchase' || type === 'reading' || type === 'forreading' || type === 'listened') {
        typeInput = 'bookState'
    }

    const typeOfColletion = {
        'verify': {
            'book': ({ booktitle }) => Book.findOne({ where: { booktitle } }),
            'bookState': ({ user_id, book_id }) => BookState.findOne({ where: { book_id, user_id, isDelete: false } }),
        },
        'create': {
            'book': ({ booktitle, author }) => Book.create({ booktitle, author_id: author }),
            'bookState': ({ user_id, book_id, type }) => BookState.create({ user_id, book_id, book_state: type }),
        }
    }

    const isBook = await typeOfColletion['verify'][typeInput](query)
    if (isBook && type === 'book') {
        throw new Error('Book is added before');
    }

    if (!isBook && type === 'book') {
        const isAuthor = await Author.findOne({ where: { name: query.author } })

        if (!isAuthor) {
            const createAuthor = await Author.create({ name: query.author });
            query.author = createAuthor.dataValues.author_id;
        }
        isAuthor && (query.author = isAuthor.dataValues.author_id);
    }

    if (isBook && typeInput === 'bookState' && type !== 'book') {
        isBook.book_state = type;
        return await isBook.save();
    }
    const create = await typeOfColletion['create'][typeInput](query);
    return create;
}

const update = async ({ author, booktitle, id }) => {
    const data = await Book.findByPk(id)

    // data.authorName = author; // To Do Adding editing author name
    data.booktitle = booktitle;
    const result = await data.save();
    return result
}


const remove = async (id) => {
    const data = await Book.findByPk(id);
    return data.destroy(); // To Do adding isDelete of True
}


module.exports = {
    getAllDate,
    getDateById,
    getInfoFromBookState,
    create,
    update,
    remove,
}
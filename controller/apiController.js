const { validationResult } = require('express-validator');

const apiService = require('../services/apiService');
const { errorParser } = require('../util/parser');
const { verify } = require('../services/verifyDataService');


const getAllDate = async (req, res, next) => {
    const page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10;
    const skipSource = (page - 1) * limit;
    const type = req.params.type;
    let typesQuery = type;
    const search = req.query.search && `%${req?.query?.search}%`;
    const user_id = req?.user?.id;

    if (type === 'purchase' || type === 'forpurchase' || type === 'reading' || type === 'forreading' || type === 'listened') {
        typesQuery = 'bookState'
    }

    const data = {
        'book': { offset: skipSource, limit, typesQuery },
        'search': { offset: skipSource, limit, typesQuery },
        'bookState': { offset: skipSource, limit, typesQuery, type, user_id }
    }

    try {
        const result = await apiService.getAllDate(data[typesQuery], search && 'Op.like', search);
        typesQuery === 'bookState' && (result.rows.map(e => {
            e.dataValues.id = e.book.id
            e.dataValues.author = e.book.author;
            e.dataValues.booktitle = e.book.booktitle;
            e.dataValues.genre = e.book.genre;
        }))
        res.status(200).json(result);
    } catch (err) {
        next(err)
        // const message = errorParser(err);
        // res.status(401).json({ message })
    }
}

const getDateById = async (req, res, next) => {

    try {
        const id = parseInt(req.params.id);
        const user_id = req?.user?.id;
        const result = await apiService.getDateById(id);
        if (user_id) {
            const resFromBookState = await apiService.getInfoFromBookState(id, user_id);
            result.dataValues.bookState = resFromBookState ? resFromBookState.book_state : false
        }
        res.status(200).json(result);
    } catch (err) {
        next(err)
        // const message = errorParser(err);
        // res.status(401).json({ message })
    }
}

const createBook = async (req, res, next) => {
    const { errors } = validationResult(req);
    try {
        if (errors.length > 0) {
            errors.status = 400;
            throw errors
        }
        const type = req.params.type;
        const user_id = req.user.id;
        const checkAccount = await verify('user', { id: user_id, isVerify: true, });
        if (checkAccount === null) {
            throw new Error('Your account is not Verify');
        }
        const { author, booktitle, book_id } = req.body;

        const result = await apiService.create({ author, booktitle, user_id, book_id, type });
        res.status(201).json(JSON.stringify(result, null, 4));
    } catch (err) {
        next(err);
        // const message = errorParser(err);
        // res.status(401).json({ message })
    }
}

const updateBook = async (req, res, next) => {
    // const query = 'UPDATE book SET author = $1, booktitle = $2 WHERE id = $3';
    const id = parseInt(req.params.id);
    const type = req.params.type;
    const { author, booktitle } = req.body;
    try {
        const result = await apiService.update({ author, booktitle, id });
        res.status(200).send(result);
    } catch (err) {
        next(err);
        // const message = errorParser(err);
        // res.status(401).json({ message })
    }
}

const deleteBook = async (req, res, next) => {
    const id = parseInt(req.params.id);

    try {
        await apiService.remove(id);
        res.status(204).end();
    } catch (err) {
        next()
        // const message = errorParser(err);
        // res.status(401).json({ message })
    }
}

module.exports = {
    getAllDate,
    getDateById,
    createBook,
    updateBook,
    deleteBook,
}
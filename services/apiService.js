const { dbConnect } = require("../config/database");

const getAllDate = async (query) => {
    const result = await dbConnect.query(query);
    return result;
}

const getDateById = async (query, id) => {
    const result = await dbConnect.query(query, [id]);
    return result;
}

const create = async (query, body) => {
    const { author, booktitle } = body;

    const result = await dbConnect.query(query, [author, booktitle]);
    return result;
}

const update = async (query, id, body) => {
    const { author, booktitle } = body;

    const result = await dbConnect.query(query, [author, booktitle, id]);
    return result
}


const remove = async (query, id) => {
    const result = await dbConnect.query(query, [id]);
    return result;
}


module.exports = {
    getAllDate,
    getDateById,
    create,
    update,
    remove,
}
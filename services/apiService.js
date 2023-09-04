const { dbConnect } = require("../config/database");

const getAllDate = async (query) => {
    const result = await dbConnect.query(query);
    return result;
}

const getDateById = async (query) => {
    // const result = await dbConnect.query(query, [id]);
    const result = await dbConnect.query(query);
    return result;
}

const create = async (query, array) => {
    const result = await dbConnect.query(query, array);
    return result;
}

const update = async (query) => {
    const result = await dbConnect.query(query);
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
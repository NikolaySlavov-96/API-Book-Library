import db from '../Model';

export const getAllStates = async () => {
    return await db.State.findAll();
};
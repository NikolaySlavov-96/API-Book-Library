import { getAllStates, } from '../services/productStatusService';

export const getStates = async (req, res, next) => {
    try {
        const result = await getAllStates();
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};
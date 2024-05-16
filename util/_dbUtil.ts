import { database, } from '../config';
import { TABLE_NAME, } from '../constants';


// interface IReturnFunction {
//     find: (data: object) => any;
//     findOne: (data: object) => any;
//     findById: (id: string) => any;
//     create: (data: object) => any;
//     findOneAndUpdate: (id: object, data: object) => any;
//     findByIdAndDelete: (id: string) => any;
//     findOneAndCount: (data: object) => any;
//     findAndSort: (data: object, sort?: object) => any;
//     findOneAndSelect: (data: object, select?: string[]) => any;
//     findByIdAndPopulate: (id: object, populate: string[]) => any;
//     countDocument: (data: object, sort?: object) => any;
//     findByCriteriaAndDelete: (data: object) => any;
//     findOneAndDelete: (id: object) => any;
// }


export default (model: string) => {
    const models = {};
    models[TABLE_NAME.USER] = database?.userModel;
    models[TABLE_NAME.BOOK] = database?.bookModel;
    models[TABLE_NAME.BOOK_STATE] = database?.bookStateModel;
    models[TABLE_NAME.AUTHOR] = database?.authorModel;
    const db = models[model];

    return {
        find: (data) => db.find(data),
        findOne: (data) => db.findOne(data),
        findById: (id) => db.findById(id),
        create: (data) => db.create(data),
        findAndCountAll: (data) => db.findAndCountAll(data),
        findOneAndUpdate: (id, data) => db.findOneAndUpdate(id, data),
        findOneAndDelete: (id) => db.findOneAndDelete(id),
        findByIdAndDelete: (id) => db.findByIdAndDelete(id),
        findOneAndCount: (data) => db.findOne(data).count(),
        findAndSort: (data, sort) => db.find(data).sort(sort || { createdAt: -1, }),
        findOneAndSelect: (data, select) => db.findOne(data).select(select),
        findByIdAndPopulate: (id, populate) => db.findById(id).populate(populate),
        countDocument: (data, sort) => db.countDocuments(data).sort(sort || { createdAt: -1, }),
        findByCriteriaAndDelete: (data) => db.deleteMany(data),
    };
};
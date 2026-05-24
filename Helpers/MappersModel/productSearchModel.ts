import { type IProductStatusByEmailRow } from '../../repositories';

import productModel from './productModel';
import userModel from './userModel';

const productSearchModel = (data: IProductStatusByEmailRow) => {
    const updateUser = userModel(data.user);
    const updateProduct = productModel({
        ...data.product,
        userStatusId: null,
    });

    return {
        ...updateUser,
        ...updateProduct,
        stateId: data.statusId,
    };
};

export default productSearchModel;

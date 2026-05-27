import { type TProductStatusByEmailRow } from '../../repositories';

import productModel from './productModel';
import userModel from './userModel';

const productSearchModel = (data: TProductStatusByEmailRow) => {
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

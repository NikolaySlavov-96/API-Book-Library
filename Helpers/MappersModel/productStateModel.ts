import { type IProductStatusWithRelations } from '../../repositories';

import productModel from './productModel';
import userModel from './userModel';

const productStateModel = (data: IProductStatusWithRelations) => {
    const updatedProduct = productModel({
        ...data.product,
        userStatusId: null,
    });
    const updateUser = userModel(data.user);

    return {
        productStateId: data.statusId,
        productStateStatus: data.isDelete,
        ...updatedProduct,
        ...updateUser,
    };
};

export default productStateModel;

import productModel from './productModel';
import userModel from './userModel';

const productStateModel = (data) => {
    const updatedProduct = productModel(data.Product);
    const updateUser = userModel(data.User);

    return {
        productStateId: data.statusId,
        productStateStatus: data.isDelete, // IsDelete
        ...updatedProduct,
        ...updateUser,
    };
};

export default productStateModel;

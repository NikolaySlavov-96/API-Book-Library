import productModel from './productModel';
import userModel from './userModel';

const productStateModel = (data) => {
    const updatedProduct = productModel(data.Product);
    const updateUser = userModel(data.User);

    return {
        productStateId: data.status,
        // productStateName: data.State.stateName,
        productStateStatus: data.isDelete, // IsDelete
        ...updatedProduct,
        ...updateUser,
    };
};

export default productStateModel;
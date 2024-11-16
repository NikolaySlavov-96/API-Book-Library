import productModel from './productModel';
import userModel from './userModel';

const productStateModel = (data) => {
    const updatedProduct = productModel(data.Book);
    const updateUser = userModel(data.User);

    return {
        productStateId: data.stateId,
        // productStateName: data.State.stateName,
        productStateStatus: data.isDelete, // IsDelete
        ...updatedProduct,
        ...updateUser,
    };
};

export default productStateModel;
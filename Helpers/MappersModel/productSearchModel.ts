import productModel from './productModel';
import userModel from './userModel';

const productSearchModel = (data) => {
    const updateUser = userModel(data);
    const updateProduct = productModel(data.BookStates.Book);

    return {
        ...updateUser,
        ...updateProduct,
        stateId: data.id, // TODO
    };
};

export default productSearchModel;
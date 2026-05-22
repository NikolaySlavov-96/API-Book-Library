import productModel from './productModel';
import userModel from './userModel';

// `data` is a ProductStatus row: the owning User, the Product, and the real statusId.
const productSearchModel = (data) => {
    const updateUser = userModel(data.User);
    const updateProduct = productModel(data.Product);

    return {
        ...updateUser,
        ...updateProduct,
        stateId: data.statusId,
    };
};

export default productSearchModel;
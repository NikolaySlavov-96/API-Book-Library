import productModel from './productModel';
import userModel from './userModel';

const productSearchModel = (data) => {
    const updateUser = userModel(data);
    // TODO: Nikolay -> Verify
    const updateProduct = productModel(data.ProductStatuses[0].Product);

    return {
        ...updateUser,
        ...updateProduct,
        stateId: data.id, // TODO
    };
};

export default productSearchModel;
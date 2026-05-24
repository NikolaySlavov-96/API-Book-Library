import { type IProductStatusWithRelations } from '../../repositories';

import productModel from './productModel';
import userModel from './userModel';

const productStateModel = (data: IProductStatusWithRelations) => {
    const updatedProduct = productModel({
        id: data.product.id,
        productTitle: data.product.productTitle,
        genre: data.product.genre,
        isVerify: data.product.isVerify,
        pages: data.product.pages,
        publishedYear: data.product.publishedYear,
        description: data.product.description,
        authors: data.product.authors,
        files: data.product.files,
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

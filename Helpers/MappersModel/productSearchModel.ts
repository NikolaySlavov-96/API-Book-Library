import { type IProductStatusByEmailRow } from '../../repositories';

import productModel from './productModel';
import userModel from './userModel';

const productSearchModel = (data: IProductStatusByEmailRow) => {
    const updateUser = userModel(data.user);
    const updateProduct = productModel({
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

    return {
        ...updateUser,
        ...updateProduct,
        stateId: data.statusId,
    };
};

export default productSearchModel;

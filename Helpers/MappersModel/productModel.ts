import { type IProductWithRelations } from '../../repositories';

import fileModel from './fileModel';

const productModel = (data: IProductWithRelations) => {
    const updatedFile = fileModel(data?.files);

    return {
        productId: data.id,
        productType: data.genre,
        productStatus: data.isVerify,
        productTitle: data.productTitle,
        pages: data.pages ?? null,
        publishedYear: data.publishedYear ?? null,
        description: data.description ?? null,
        statusId: data.userStatusId ?? null,
        authors: (data.authors ?? []).filter((a) => a?.name).map((a) => ({ id: a.id, name: a.name })),
        authorsSeparator: data.authorsSeparator ?? ',',
        ...updatedFile,
    };
};

export default productModel;

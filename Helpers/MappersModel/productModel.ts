import { type IProductWithRelations } from '../../repositories';

import fileModel from './fileModel';

const productModel = (data: IProductWithRelations) => {
    const authorsName =
        data.authors
            ?.map((a) => a?.name)
            .filter(Boolean)
            .join(', ') ?? '';
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
        authorName: authorsName,
        authorImage: undefined,
        authorGenre: undefined,
        authorStatus: undefined,
        ...updatedFile,
    };
};

export default productModel;

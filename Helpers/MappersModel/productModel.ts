import fileModel from './fileModel';

const productModel = (data) => {
    const author = data.Author;
    const updatedFile = fileModel(data?.Files);

    return {
        productId: data.id,
        productType: data.genre,
        productStatus: data.isVerify, // IsVerify
        productTitle: data.productTitle,
        authorName: author.name,
        authorImage: author.image,
        authorGenre: author.genre,
        authorStatus: author.isVerify,
        ...updatedFile,
    };
};

export default productModel;
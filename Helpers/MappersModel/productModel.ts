import fileModel from './fileModel';

const productModel = (data) => {
    const authors = data.authors;
    let authorsName = '';
    authors?.forEach(a => {
        if (authorsName !== '') {
            authorsName += ', ';
        }
        authorsName += a.name;
    });
    const updatedFile = fileModel(data?.files);

    return {
        productId: data.id,
        productType: data.genre,
        productStatus: data.isVerify, // IsVerify
        productTitle: data.productTitle,
        authorName: authorsName, // author.name,
        authorImage: undefined, // author.image,
        authorGenre: undefined, // author.genre,
        authorStatus: undefined, // author.isVerify,
        ...updatedFile,
    };
};

export default productModel;
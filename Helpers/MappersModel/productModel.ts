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

    // The user's current shelf status for this product, when the catalog query joined it
    // in. Missing / empty → the book isn't on the user's shelf (or it's a guest request).
    const userStatuses = data.ProductStatuses;
    const statusId = userStatuses?.length ? userStatuses[0].statusId : null;

    return {
        productId: data.id,
        productType: data.genre,
        productStatus: data.isVerify, // IsVerify
        productTitle: data.productTitle,
        pages: data.pages ?? null,
        publishedYear: data.publishedYear ?? null,
        description: data.description ?? null,
        statusId,
        authorName: authorsName, // author.name,
        authorImage: undefined, // author.image,
        authorGenre: undefined, // author.genre,
        authorStatus: undefined, // author.isVerify,
        ...updatedFile,
    };
};

export default productModel;
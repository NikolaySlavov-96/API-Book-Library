export enum _EMappedType {
    BOOK = 0,
    BOOK_STATE,
    BOOK_SEARCH,
}

const bookModel = (data) => {
    return {
        bookId: data?.id,
        bookImage: data?.image,
        bookGenre: data?.genre,
        bookIsVerify: data?.isVerify,
        bookTitle: data?.bookTitle,
        authorName: data['Author.name'],
        authorImage: data['Author.image'],
        authorGenre: data['Author.genre'],
        authorIsVerify: data['Author.isVerify'],
    };
};

const _responseMapper = (result, type: _EMappedType) => {

    if (type === _EMappedType.BOOK) {
        result.rows.map(b => bookModel(b));
        return result;
    }

    return result;
};

export default _responseMapper;
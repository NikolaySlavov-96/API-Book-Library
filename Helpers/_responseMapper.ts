import 'dotenv/config';

import { SYSTEM_FILE_DIRECTORY, } from '../constants';

const { BE_URL, } = process.env;

const FILE_PATH = BE_URL + SYSTEM_FILE_DIRECTORY.UPLOAD + '/';

export enum _EMappedType {
    BOOK = 0,
    BOOK_STATE,
    BOOK_SEARCH,
}

const userModel = (data) => {
    return {
        email: data.email,
        userId: data.id,
        userYear: data?.year,
        userIdVerify: data.isVerify,
    };
};

const fileModel = (data) => {
    return {
        imageUrl: FILE_PATH + data?.uniqueName,
        bookSrc: data?.src,
        imageId: data?.id,
    };
};

const bookModel = (data) => {
    const author = data.Author;
    const updatedFile = fileModel(data?.Files);

    return {
        bookId: data.id,
        bookGenre: data.genre,
        bookIsVerify: data.isVerify,
        bookTitle: data.bookTitle,
        authorName: author.name,
        authorImage: author.image,
        authorGenre: author.genre,
        authorIsVerify: author.isVerify,
        ...updatedFile,
    };
};

const bookStateModel = (data) => {
    const updatedBook = bookModel(data.Book);
    const updateUser = userModel(data.User);

    return {
        bookStateId: data.stateId,
        // bookStateName: data.State.stateName,
        bookStateIsDelete: data.isDelete,
        ...updatedBook,
        ...updateUser,
    };
};

const bookSearchModel = (data) => {
    const updateUser = userModel(data);
    const updateBook = bookModel(data.BookStates.Book);

    return {
        ...updateUser,
        ...updateBook,
        stateId: data.id, // TODO
    };
};

export const _mappedSingleObject = (result, type: _EMappedType) => {
    if (type === _EMappedType.BOOK) {
        return bookModel(result);
    }

    if (type === _EMappedType.BOOK_SEARCH) {
        return bookSearchModel(result);
    }

    if (type === _EMappedType.BOOK_STATE) {
        return bookStateModel(result);
    }

    return result;
};

const _responseMapper = (result, type: _EMappedType) => {
    const mappedResult = {
        count: result.count,
        rows: [],
    };

    if (type === _EMappedType.BOOK) {
        mappedResult.rows = result.rows.map(b => bookModel(b));
        return mappedResult;
    }

    if (type === _EMappedType.BOOK_SEARCH) {
        mappedResult.rows = result.rows.map(bsh => bookSearchModel(bsh));
        return mappedResult;
    }

    if (type === _EMappedType.BOOK_STATE) {
        mappedResult.rows = result.rows.map(bs => bookStateModel(bs));
        return mappedResult;
    }

    return result;
};

export default _responseMapper;
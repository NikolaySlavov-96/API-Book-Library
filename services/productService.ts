import { MESSAGES } from '../constants';
import { EMappedType, mappedSingleObject, responseMapper } from '../Helpers';
import { repositories } from '../repositories';
import { updateMessage } from '../util';

import { getRatingAggregate } from './productRatingService';

const FILTER_OPERATOR_ILIKE = 'iLike';

export const getAllData = async ({ offset, limit, filterOperator, searchContent, statusId, userId }) => {
    const result = await repositories.product.findAndCount({
        offset,
        limit,
        filterOperator,
        searchContent,
        statusId,
        userId,
    });

    return responseMapper(result, EMappedType.PRODUCT);
};

export const getDataById = async (id: number) => {
    const result = await repositories.product.findById(id);

    const mappedResponse = mappedSingleObject(result, EMappedType.PRODUCT);

    if (mappedResponse) {
        const aggregate = await getRatingAggregate(id);
        (mappedResponse as Record<string, unknown>).ratingAverage = aggregate.average;
        (mappedResponse as Record<string, unknown>).ratingCount = aggregate.count;
    }

    return mappedResponse;
};

const checkAndInsertAuthors = async (authors: string): Promise<number[]> => {
    const authorsIds: number[] = [];
    const authorsName = authors.split('<->');

    for (const authorName of authorsName) {
        const trimmedName = authorName.trim();

        const isAuthor = await repositories.author.findByName(trimmedName);
        if (!isAuthor) {
            const created = await repositories.author.create({ name: trimmedName });
            authorsIds.push(created.id);
            continue;
        }
        authorsIds.push(isAuthor.id);
    }
    return authorsIds;
};

const insertProductAuthors = async (productId: number, authorsIds: number[]): Promise<void> => {
    for (const authorId of authorsIds) {
        await repositories.productAuthor.create({ productId, authorId });
    }
};

const insertProductFiles = async (productId: number, filesId: number[]): Promise<void> => {
    for (const fileId of filesId) {
        await repositories.productFile.create({ productId, fileId });
    }
};

export const create = async ({ author, productTitle, genre, filesId, pages, publishedYear, description }) => {
    const modTitle = productTitle.trim();
    const modGenre = genre?.trim();

    const existingProduct = await repositories.product.findByTitleCaseInsensitive(modTitle);

    if (existingProduct) {
        return updateMessage(MESSAGES.PRODUCT_ALREADY_EXIST, 403);
    }

    const authorsId = await checkAndInsertAuthors(author);

    const created = await repositories.product.create({
        productTitle: modTitle,
        genre: modGenre,
        pages,
        publishedYear,
        description: description?.trim(),
    });

    if (filesId?.length) {
        await insertProductFiles(created.id, filesId);
    }

    await insertProductAuthors(created.id, authorsId);

    return created;
};

export const update = async (id, _body) => {
    // TODO: implement update flow against the new repository interface
    void id;
    return null;
};

export const remove = async (id) => {
    // TODO: implement soft-delete via repositories
    void id;
    return null;
};

// `iLike` is the canonical operator name passed from controllers — kept as a
// module-level constant so we can swap operator semantics in one place.
export const PRODUCT_FILTER_OPERATOR = FILTER_OPERATOR_ILIKE;

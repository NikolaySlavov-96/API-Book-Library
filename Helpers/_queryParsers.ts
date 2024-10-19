export const _pageParser = (query) => {
    const page = parseInt(query?.page) || 1;
    const limit = parseInt(query?.limit) || 10;

    const maxLimit = Math.min(limit, 140);
    const skipSource = (page - 1) * maxLimit;

    return {
        limit: maxLimit,
        offset: skipSource,
    };
};

export const _emailParser = (query) => {
    const page = parseInt(query?.page) || 1;
    const limit = parseInt(query?.limit) || 10;

    const maxLimit = Math.min(limit, 140);
    const skipSource = (page - 1) * maxLimit;

    const email = query?.email as string;
    const searchContent = query.search && `%${query?.search}%`;

    return {
        limit: maxLimit,
        offset: skipSource,
        email,
        searchContent,
    };
};

export const _searchParser = (query) => {
    const searchContent = query.search && `%${query?.search}%`;

    return {
        searchContent,
    };
};
const _queryParser = (query) => {
    const page = parseInt(query?.page) || 1;
    const limit = parseInt(query?.limit) || 10;

    const maxLimit = Math.max(limit, 140);
    const skipSource = (page - 1) * maxLimit;

    const email = query?.email as string;
    const searchContent = query.search && `%${query?.search}%`;

    return {
        limit,
        offset: skipSource,
        email,
        searchContent,
    };
};

export default _queryParser;
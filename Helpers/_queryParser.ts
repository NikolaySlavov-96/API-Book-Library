const _queryParser = (query) => {
    const page = parseInt(query?.page) || 1;
    const limit = parseInt(query?.limit) || 10;

    const maxLimit = Math.max(limit, 140);
    const skipSource = (page - 1) * maxLimit;

    return {
        limit,
        offset: skipSource,
    };
};

export default _queryParser;
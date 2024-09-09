const _paginationParser = (query) => {
    const page = parseInt(query?.page) || 1;
    const limit = parseInt(query?.limit) || 10;

    const skipSource = (page - 1) * limit;

    return {
        limit,
        offset: skipSource,
    };
};

export default _paginationParser;
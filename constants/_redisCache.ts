const _redisCacheKeys = {
    ALL_BOOKS: 'all-books-',
    BOOK_ID: 'book-id-',
    BOOK_STATE_ID: 'book-state-id-',
};

export default _redisCacheKeys;

// TTL in seconds
export const _redisCacheTimes = {
    HOURS: 3600, // (1 hours)
};
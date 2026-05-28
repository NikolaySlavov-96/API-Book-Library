const parseAllowedOrigins = (): string[] => {
    const raw = process.env.CORS_ORIGIN ?? process.env.WEB_URI ?? '';
    return raw
        .split(',')
        .map((o) => o.trim())
        .filter(Boolean);
};

export default (_whitelist?: string | string[]) => {
    const allowedOrigins = parseAllowedOrigins();

    return (req, res, next) => {
        const requestOrigin = req.headers.origin;
        if (requestOrigin && allowedOrigins.includes(requestOrigin)) {
            res.setHeader('Access-Control-Allow-Origin', requestOrigin);
            res.setHeader('Vary', 'Origin');
            res.setHeader('Access-Control-Allow-Credentials', 'true');
        }
        res.setHeader('Access-Control-Allow-Methods', 'HEAD, OPTIONS, GET, POST, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        if (req.method === 'OPTIONS') {
            res.sendStatus(204);
            return;
        }

        next();
    };
};

import db from '../Model';

export const upsertRating = async (userId, { productId, rating }) => {
    const existing = await db.ProductRating.findOne({ where: { userId, productId } });

    if (existing) {
        existing.rating = rating;
        return await existing.save();
    }

    const result = (await db.ProductRating.create({ userId, productId, rating }))?.dataValues;
    return result;
};

export const getRatingAggregate = async (productId) => {
    const result: any = await db.ProductRating.findOne({
        where: { productId },
        attributes: [
            [db.sequelize.fn('AVG', db.sequelize.col('rating')), 'average'],
            [db.sequelize.fn('COUNT', db.sequelize.col('rating')), 'count'],
        ],
        raw: true,
    });

    return {
        average: result?.average ? Number(Number(result.average).toFixed(2)) : 0,
        count: result?.count ? Number(result.count) : 0,
    };
};

export const getUserRating = async (userId, productId) => {
    const result = await db.ProductRating.findOne({
        where: { userId, productId },
        attributes: ['rating'],
    });

    return result?.dataValues?.rating ?? 0;
};

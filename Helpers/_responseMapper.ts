import { productModel, productSearchModel, productStateModel, } from './MappersModel';

export enum _EMappedType {
    PRODUCT = 0,
    PRODUCT_STATE,
    PRODUCT_SEARCH,
}

export const _mappedSingleObject = (result, type: _EMappedType) => {
    if (type === _EMappedType.PRODUCT) {
        return productModel(result);
    }

    if (type === _EMappedType.PRODUCT_SEARCH) {
        return productSearchModel(result);
    }

    if (type === _EMappedType.PRODUCT_STATE) {
        return productStateModel(result);
    }

    return result;
};

const _responseMapper = (result, type: _EMappedType) => {
    const mappedResult = {
        count: result.count,
        rows: [],
    };

    if (type === _EMappedType.PRODUCT) {
        mappedResult.rows = result.rows.map((b) => productModel(b));
        return mappedResult;
    }

    if (type === _EMappedType.PRODUCT_SEARCH) {
        mappedResult.rows = result.rows.map((bsh) => productSearchModel(bsh));
        return mappedResult;
    }

    if (type === _EMappedType.PRODUCT_STATE) {
        mappedResult.rows = result.rows.map((bs) => productStateModel(bs));
        return mappedResult;
    }

    return result;
};

export default _responseMapper;
import {
    type IProductListResult,
    type IProductStatusByEmailResult,
    type IProductStatusListResult,
    type IProductStatusByEmailRow,
    type IProductStatusWithRelations,
    type IProductWithRelations,
} from '../repositories';

import { productModel, productSearchModel, productStateModel } from './MappersModel';

export enum _EMappedType {
    PRODUCT = 0,
    PRODUCT_STATE,
    PRODUCT_SEARCH,
}

export const _mappedSingleObject = (result: IProductWithRelations | null, type: _EMappedType) => {
    if (!result) {
        return result;
    }

    if (type === _EMappedType.PRODUCT) {
        return productModel(result);
    }

    return result;
};

type TPaginatedRepoResult = IProductListResult | IProductStatusListResult | IProductStatusByEmailResult;

const _responseMapper = (result: TPaginatedRepoResult, type: _EMappedType) => {
    const mappedResult = {
        count: result.count,
        rows: [] as unknown[],
    };

    if (type === _EMappedType.PRODUCT) {
        const productResult = result as IProductListResult;
        mappedResult.rows = productResult.rows.map((row) => productModel(row));
        return mappedResult;
    }

    if (type === _EMappedType.PRODUCT_SEARCH) {
        const searchResult = result as IProductStatusByEmailResult;
        mappedResult.rows = searchResult.rows.map((row: IProductStatusByEmailRow) => productSearchModel(row));
        return mappedResult;
    }

    if (type === _EMappedType.PRODUCT_STATE) {
        const stateResult = result as IProductStatusListResult;
        mappedResult.rows = stateResult.rows.map((row: IProductStatusWithRelations) => productStateModel(row));
        return mappedResult;
    }

    return result;
};

export default _responseMapper;

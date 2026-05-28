import {
    type TProductListResult,
    type TProductStatusByEmailResult,
    type TProductStatusByEmailRow,
    type TProductStatusListResult,
    type TProductStatusWithRelations,
    type TProductWithRelations,
} from '../repositories';

import { productModel, productSearchModel, productStateModel } from './MappersModel';

export enum _EMappedType {
    PRODUCT = 0,
    PRODUCT_STATE,
    PRODUCT_SEARCH,
}

export const _mappedSingleObject = (result: TProductWithRelations | null, type: _EMappedType) => {
    if (!result) {
        return result;
    }

    if (type === _EMappedType.PRODUCT) {
        return productModel(result);
    }

    return result;
};

type TPaginatedRepoResult = TProductListResult | TProductStatusListResult | TProductStatusByEmailResult;

const _responseMapper = (result: TPaginatedRepoResult, type: _EMappedType) => {
    const mappedResult = {
        count: result.count,
        rows: [] as unknown[],
    };

    if (type === _EMappedType.PRODUCT) {
        const productResult = result as TProductListResult;
        mappedResult.rows = productResult.rows.map((row) => productModel(row));
        return mappedResult;
    }

    if (type === _EMappedType.PRODUCT_SEARCH) {
        const searchResult = result as TProductStatusByEmailResult;
        mappedResult.rows = searchResult.rows.map((row: TProductStatusByEmailRow) => productSearchModel(row));
        return mappedResult;
    }

    if (type === _EMappedType.PRODUCT_STATE) {
        const stateResult = result as TProductStatusListResult;
        mappedResult.rows = stateResult.rows.map((row: TProductStatusWithRelations) => productStateModel(row));
        return mappedResult;
    }

    return result;
};

export default _responseMapper;

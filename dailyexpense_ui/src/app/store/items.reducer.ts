import { createReducer, on } from '@ngrx/store';
import { resetItemList, resetPriceHistory, updateItemList, updatePriceHistory } from './items.actions';
import { PriceHistory } from '../models/models';

export const initialState: string[] = [];
export const initialStatePriceHistory: PriceHistory[] = [];

const _itemReducer = createReducer(
    initialState,
    on(updateItemList, (state, { itemList }) => [...state, ...itemList]), // Add new company to the list,
    on(resetItemList, (state, { itemList }) => [...itemList]), // Add new company to the list
);

const _pricehistoryReducer = createReducer(
    initialStatePriceHistory,
    on(updatePriceHistory, (state, { itemList }) => [...state, ...itemList]), // Add new company to the list
    on(resetPriceHistory, (state, { itemList }) => [...state, ...itemList]), // Add new company to the list
);

export function itemReducer(state: any, action: any) {
    return _itemReducer(state, action);
}

export function pricehistoryReducer(state: any, action: any) {
    return _pricehistoryReducer(state, action);
}

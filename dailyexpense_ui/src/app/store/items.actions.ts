import { createAction, props } from '@ngrx/store';
import { PriceHistory } from '../models/models';

export const updateItemList = createAction(
    '[Items] Update Item List',
    props<{ itemList: string[] }>()
);

export const resetItemList = createAction(
    '[Items] Reset Item List',
    props<{ itemList: string[] }>()
);

export const updatePriceHistory = createAction(
    '[Items] Update Price History List',
    props<{ itemList: PriceHistory[] }>()
);

export const resetPriceHistory = createAction(
    '[Items] Reset Price History List',
    props<{ itemList: PriceHistory[] }>()
);

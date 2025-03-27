import { createReducer, on } from '@ngrx/store';
import { resetLocationList, updateLocationList } from './location.actions';

export const initialState: string[] = [];

const _locationReducer = createReducer(
    initialState,
    on(updateLocationList, (state, { locationList }) => [...state, ...locationList]), // Add new company to the list,
    on(resetLocationList, (state, { locationList }) => [...locationList]), // Add new company to the list
);

export function locationReducer(state: any, action: any) {
    return _locationReducer(state, action);
}

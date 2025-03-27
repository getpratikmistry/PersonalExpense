import { createAction, props } from '@ngrx/store';

export const updateLocationList = createAction(
  '[Location] Update Location List',
  props<{ locationList: string[] }>()
);
export const resetLocationList = createAction(
  '[Location] Reset Location List',
  props<{ locationList: string[] }>()
);

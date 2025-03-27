import { createAction, props } from '@ngrx/store';
import { Company } from '../models/models';

export const addCompany = createAction(
  '[Company] Add Company',
  props<{ cmp: Company }>()
);

export const removeCompany = createAction(
  '[Company] Remove Company',
  props<{ id: number }>()
);

export const updateCompany = createAction(
  '[Company] Update Company',
  props<{ cmp: Company }>()
);

export const updateCompanyList = createAction(
  '[Company] Update Company List',
  props<{ cmplist: Company[] }>()
);

export const resetCompanyList = createAction(
  '[Company] Reset Company List',
  props<{ cmplist: Company[] }>()
);

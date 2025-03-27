import { createReducer, on } from '@ngrx/store';
import { resetCompanyList, updateCompany, updateCompanyList } from './company.actions';
import { Company } from '../models/models';

export const initialState: Company[] = [];

const _companyReducer = createReducer(
  initialState,
  on(updateCompany, (state, { cmp }) => [...state, cmp]), // Add new company to the list,
  on(updateCompanyList, (state, { cmplist }) => [...state, ...cmplist]), // Add new company to the list
  on(resetCompanyList, (state, { cmplist }) => [...cmplist]), // Add new company to the list
);

export function companyReducer(state: any, action: any) {
  return _companyReducer(state, action);
}

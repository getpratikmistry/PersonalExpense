import { ExpenseResponse } from "../cores/models";
import { Company } from "../entities/company";
import { Expense } from "../entities/expense";

export interface IExpenseRepository {
    findAll(): Promise<Expense[]>;
    findById(id: number): Promise<Expense>;
    getLocations(searchText: string): Promise<string[]>;
    getCompanies(searchText: string): Promise<Company[]>;
    getDashboardDetails(): Promise<any>;
    create(book: Expense): Promise<ExpenseResponse>;
    update(book: Expense): Promise<ExpenseResponse>;
    delete(id: number): Promise<ExpenseResponse>;
    deleteExpenseDetails(id: number): Promise<ExpenseResponse>;
}
import { ExpenseResponse, listOptions } from "../cores/models";
import { Company } from "../entities/company";
import { Expense } from "../entities/expense";
import { IExpenseItemRepository } from "../interface/IExpenseItemRepository";
import { IExpenseRepository } from "../interface/IExpenseRepository";

export class ExpenseService {
    constructor(private expenseRepository: IExpenseRepository, private expenseItemRepository: IExpenseItemRepository) { }

    async GetAll(): Promise<Expense[]> {
        return await this.expenseRepository.findAll();
    }

    async GetbyId(id: number): Promise<Expense> {
        let expense: Expense = await this.expenseRepository.findById(id);
        expense.ExpenseItems = await this.expenseItemRepository.findByExpenseId(id);
        return expense;
    }

    async GetLocations(searchText: string = ""): Promise<listOptions> {
        const locations: string[] = await this.expenseRepository.getLocations(searchText);
        const items: string[] = await this.expenseItemRepository.getItems(searchText);
        const company: Company[] = await this.expenseRepository.getCompanies(searchText);
        return {
            Locations: locations.length > 0 ? locations : [],
            Items: items.length > 0 ? items : [],
            Companies: company
        } as listOptions;
    }

    async getDashboardDetails(): Promise<any> {
        const locations: any = await this.expenseRepository.getDashboardDetails();
        return locations;
    }
    
    async create(expense: Expense): Promise<ExpenseResponse> {
        const expResponse: ExpenseResponse = await this.expenseRepository.create(expense);
        expense.ExpenseItems = expense.ExpenseItems ?? [];
        const newExpenseId: number = expResponse?.NewExpenseId ?? 0;
        if (newExpenseId > 0 && expense.ExpenseItems.length > 0) {
            expense.ExpenseItems.forEach(x => { x.ExpenseId = newExpenseId; })
            await this.expenseItemRepository.save(expense.ExpenseItems);
        }
        return expResponse;
    }
    
    async update(expense: Expense): Promise<ExpenseResponse> {
        const expResponse: ExpenseResponse = await this.expenseRepository.update(expense);
        expense.ExpenseItems = expense.ExpenseItems ?? [];
        const expenseId: number = expResponse?.UpdatedExpenseId ?? 0;
        if (expenseId > 0 && expense.ExpenseItems.length > 0) {
            expense.ExpenseItems.forEach(x => { x.ExpenseId = expenseId; })
            await this.expenseItemRepository.save(expense.ExpenseItems);
        }
        return expResponse;
    }
    
    async delete(id: number): Promise<ExpenseResponse> {
        return await this.expenseRepository.delete(id);
    }
    
    async deleteExpenseDetails(id: number): Promise<ExpenseResponse> {
        return await this.expenseRepository.deleteExpenseDetails(id);
    }
}
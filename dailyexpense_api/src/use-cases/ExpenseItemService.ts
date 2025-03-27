import { ExpenseItemResponse } from "../cores/models";
import { ExpenseItem, ItemHistory } from "../entities/expense-item";
import { IExpenseItemRepository } from "../interface/IExpenseItemRepository";

export class ExpenseItemService {
    constructor(private expenseItemRepository: IExpenseItemRepository) { }

    async GetAll(): Promise<ExpenseItem[]> {
        return await this.expenseItemRepository.findAll();
    }

    async getByExpenseId(expenseId: number): Promise<ExpenseItem[]> {
        return await this.expenseItemRepository.findByExpenseId(expenseId);
    }

    async getById(id: number): Promise<ExpenseItem> {
        return await this.expenseItemRepository.findById(id);
    }

    async getItemHistory(searchText: string = ""): Promise<ItemHistory[]> {
        return await this.expenseItemRepository.getItemsHistory(searchText);
    }

    async create(expenseItem: ExpenseItem): Promise<ExpenseItemResponse> {
        return await this.expenseItemRepository.create(expenseItem);
    }

    async update(expenseItem: ExpenseItem): Promise<ExpenseItemResponse> {
        return await this.expenseItemRepository.update(expenseItem);
    }

    async delete(id: number): Promise<ExpenseItemResponse> {
        return await this.expenseItemRepository.delete(id);
    }
}
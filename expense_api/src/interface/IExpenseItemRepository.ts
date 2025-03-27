import { ExpenseItemResponse } from "../cores/models";
import { ExpenseItem, ItemHistory } from "../entities/expense-item"; 

export interface IExpenseItemRepository {
    findAll(): Promise<ExpenseItem[]>;
    findByExpenseId(expenseId: number): Promise<ExpenseItem[]>;
    findById(id: number): Promise<ExpenseItem>;
    getItemsHistory(searchText: string): Promise<ItemHistory[]>
    getItems(searchText: string): Promise<string[]>
    save(book: ExpenseItem[]): Promise<ExpenseItemResponse>;
    create(book: ExpenseItem): Promise<ExpenseItemResponse>;
    update(book: ExpenseItem): Promise<ExpenseItemResponse>;
    delete(id: number): Promise<ExpenseItemResponse>;
}
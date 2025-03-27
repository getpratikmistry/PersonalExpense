import { ExpenseItemResponse } from "../cores/models";
import { ExpenseItem, ItemHistory } from "../entities/expense-item";
import { IExpenseItemRepository } from "../interface/IExpenseItemRepository";
import { MariaDatabase } from "../mariadb";

export class ExpenseItemRepository implements IExpenseItemRepository {
    private database?: MariaDatabase;
    constructor() {
        this.database = new MariaDatabase();
    }

    async findAll(): Promise<ExpenseItem[]> {
        if (this.database) {
            const sqlquery: string = `CALL GetExpenseItems()`;
            const result: ExpenseItem[] = await this.database.executeQuery(sqlquery);
            return result;
        }
        else {
            return [];
        }
    }

    async findByExpenseId(id: number): Promise<ExpenseItem[]> {
        if (this.database) {
            const sqlquery: string = `CALL GetExpenseItemsByExpenseId(?)`;
            const params = [id];
            const result: ExpenseItem[] = await this.database.executeQuery(sqlquery, params);
            return result;
        }
        else {
            return [];
        }
    }

    async findById(id: number): Promise<ExpenseItem> {
        if (this.database) {
            const sqlquery: string = `CALL GetExpenseItemById(?)`;
            const params = [id];
            const result: ExpenseItem[] = await this.database.executeQuery(sqlquery, params);
            if(result) {
                return result[0];
            }
            else {
                return {} as ExpenseItem;
            }
        }
        else {
            return {} as ExpenseItem;
        }
    }
        
    async getItems(searchText: string = ""): Promise<string[]> {
        if (this.database) {
            const sqlquery: string = `CALL GetItems(?)`;
            const params = [searchText];
            const result: ExpenseItem[] = await this.database.executeQuery(sqlquery, params);
            if(result) {
                return result.map(item => item.Itemname);
            }
            else {
                return [];
            }
        }
        else {
            return [];
        }
    }
        
    async getItemsHistory(searchText: string = ""): Promise<ItemHistory[]> {
        if (this.database) {
            const sqlquery: string = `CALL GetItemHistory(?,?,?)`;
            const params = [searchText, 1, 1];
            const result: ItemHistory[] = await this.database.executeQuery(sqlquery, params);
            if(result) {
                return result;
            }
            else {
                return [];
            }
        }
        else {
            return [];
        }
    }

    async save(items: ExpenseItem[]): Promise<ExpenseItemResponse> {
        if (!this.database) {
            return { success: false, message: "Database not initialized" } as ExpenseItemResponse;
        }
    
        try {
            const promises = items.map((item) => {
                switch (true) {
                    case item.Flag === -1:
                        return this.delete(item.ItemId);
                    case item.ItemId > 0:
                        return this.update(item);
                    default:
                        return this.create(item);
                }
            });
    
            const results = await Promise.all(promises);
    
            return {
                success: true,
                message: `${results.length} operations completed successfully.`,
                NewItemId: results.length,
            } as ExpenseItemResponse;
        } catch (error) {
            console.error("Error saving expense items:", error);
            return {
                success: false,
                message: "An error occurred while saving items.",
            } as ExpenseItemResponse;
        }
    }

    async create(expense: ExpenseItem): Promise<ExpenseItemResponse> {
        if (this.database) {
            let createdDate = (expense.CreatedDate ?? new Date().toLocaleDateString('en-CA')).replace("T", " ").replace("Z", "")
            let updatedDate = (expense.UpdatedDate ?? new Date().toLocaleDateString('en-CA')).replace("T", " ").replace("Z", "")
            const sqlquery: string = `CALL CreateExpenseItem(?,?,?,?,?,?,?,?,?,?,?);`;
            const params = [expense.ItemId,expense.ExpenseId,expense.Itemname,expense.UnitId,expense.Quantity,expense.Amount,
                expense.PPU,(expense.CreatedBy ?? 1), createdDate,(expense.UpdatedBy ?? 1), updatedDate];
            const result: ExpenseItemResponse[] = await this.database.executeQuery(sqlquery, params);
            if(result) {
                return result[0];
            }
            else {
                return {} as ExpenseItemResponse;
            }
        }
        else {
            return {} as ExpenseItemResponse;
        }
    }

    async update(expense: ExpenseItem): Promise<ExpenseItemResponse> {
        if (this.database) {
            let createdDate = (expense.CreatedDate ?? new Date().toLocaleDateString('en-CA')).replace("T", " ").replace("Z", "")
            let updatedDate = (expense.UpdatedDate ?? new Date().toLocaleDateString('en-CA')).replace("T", " ").replace("Z", "")
            const sqlquery: string = `CALL UpdateExpenseItem(?,?,?,?,?,?,?,?,?,?,?);`;
            const params = [expense.ItemId,expense.ExpenseId,expense.Itemname,expense.UnitId,expense.Quantity,expense.Amount,
                expense.PPU,(expense.CreatedBy ?? 1), createdDate,(expense.UpdatedBy ?? 1),
                updatedDate];
            const result: ExpenseItemResponse[] = await this.database.executeQuery(sqlquery, params);
            if(result) {
                return result[0];
            }
            else {
                return {} as ExpenseItemResponse;
            }
        }
        else {
            return {} as ExpenseItemResponse;
        }
    }

    async delete(id: number): Promise<ExpenseItemResponse> {
        if (this.database) {
            const sqlquery: string = `CALL DeleteExpenseItemById(?)`;
            const params = [id];
            const result: ExpenseItemResponse[] = await this.database.executeQuery(sqlquery, params);
            if(result) {
                return result[0];
            }
            else {
                return {} as ExpenseItemResponse;
            }
        }
        else {
            return {} as ExpenseItemResponse;
        }
    }
}
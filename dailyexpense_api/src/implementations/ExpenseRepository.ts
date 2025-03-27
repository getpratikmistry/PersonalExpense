import { LogService } from "../cores/LogService";
import { Company } from "../entities/company";
import { Expense } from "../entities/expense";
import { IExpenseRepository } from "../interface/IExpenseRepository";
import { MariaDatabase } from "../mariadb";

export class ExpenseRepository implements IExpenseRepository {
    private database?: MariaDatabase;
    private logService: LogService;

    constructor() {
        this.database = new MariaDatabase();
        this.logService = new LogService();
    }

    async findAll<Expense>(): Promise<Expense[]> {
        try {
            if (this.database) {
                const sqlquery: string = `CALL GetAllExpenses()`
                const result: Expense[] = await this.database.executeQuery(sqlquery);
                await this.logService.logAction('GetAllExpenses', 'Retrieved all Expenses');
                return result;
            }
            else {
                await this.logService.logAction('GetAllExpenses', 'No expenses found');
                return [];
            }
        } catch (error: any) {
            await this.logService.logError('GetAllExpenses Error', error.message);
            throw error;
        }
    }

    async findById<Expense>(id: number): Promise<Expense> {
        try {
            if (this.database) {
                const sqlquery: string = `CALL GetExpenseById(?)`;
                const params = [id];
    
                const result: Expense[] = await this.database.executeQuery<Expense[]>(sqlquery, params);
                await this.logService.logAction('GetExpenseById', `Retrieved ExpenseId ${id}.`);
                return result[0];
            }
            else {
                await this.logService.logAction('GetExpenseById', `No ExpenseId ${id} found.`);
                return {} as Expense;
            }
        } catch (error: any) {
            await this.logService.logError('GetExpenseById Error', error.message);
            throw error;
        }
    }
    
    async getLocations(searchText: string = ""): Promise<string[]> {
        try {
            if (this.database) {
                const sqlquery: string = `CALL GetLocations(?)`;
                const params = [searchText];
                const result: Expense[] = await this.database.executeQuery(sqlquery, params);
                if(result && result.length > 0) {
                    await this.logService.logAction('GetLocations', `Retrieved Locatons.`);
                    return result.map(item => item.Location);
                }
                else {
                    await this.logService.logAction('GetLocations', `No Locatons retrieved.`);
                    return [];
                }
            }
            else {
                return [];
            }
        } catch (error: any) {
            await this.logService.logError('GetLocations Error', error.message);
            throw error;
        }
    }
    
    async getCompanies(searchText: string = ""): Promise<Company[]> {
        try {
            if (this.database) {
                const sqlquery: string = `CALL GetAllCompanyDetails()`;
                const result: Company[] = await this.database.executeQuery(sqlquery);
                if(result && result.length > 0) {
                    await this.logService.logAction('GetAllCompanyDetails', `Retrived company details.`);
                    return result;
                }
                else {
                    await this.logService.logAction('GetAllCompanyDetails', `No company details found.`);
                    return [];
                }
            }
            else {
                return [];
            }
        } catch (error: any) {
            await this.logService.logError('GetAllCompanyDetails Error', error.message);
            throw error;
        }
    }

    async getDashboardDetails() {
        try {
            if (this.database) {
                const sqlquery: string = `CALL GetDashboardDetails()`;
                const result = await this.database.executeMultipleQuery(sqlquery);
                await this.logService.logAction('GetDashboardDetails', `Dashboard details retrieved successfully.`);
                return result;
            }
            else {
                await this.logService.logAction('GetDashboardDetails', `No dashboard details retrieved.`);
                return {};
            }
        } catch (error: any) {
            await this.logService.logError('GetDashboardDetails Error', error.message);
            throw error;
        }
    }

    async create<ExpenseResponse>(expense: Expense): Promise<ExpenseResponse> {
        try {
            if (this.database) {
                let createdDate = (expense.CreatedDate ?? new Date().toLocaleDateString('en-CA')).replace("T", " ").replace("Z", "")
                let updatedDate = (expense.UpdatedDate ?? new Date().toLocaleDateString('en-CA')).replace("T", " ").replace("Z", "")
                
                const sqlquery: string = `CALL CreateExpense(?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
                const params = [expense.ExpenseId, expense.ExpenseDate.replace("T", " ").replace("Z", ""), expense.CompanyId, expense.Location, expense.Tax, expense.TaxAmount,
                    expense.SubTotalAmount, expense.Discount, expense.NetAmount, expense.IsAmountModified, (expense.CreatedBy ?? 1), createdDate
                    , (expense.UpdatedBy ?? 1), updatedDate];
                const result: ExpenseResponse[] = await this.database.executeQuery(sqlquery, params);
                if(result) {
                    await this.logService.logAction('CreateExpense', `Expense created successfully.`);
                    return result[0];
                }
                else {
                    await this.logService.logAction('CreateExpense', `No expense created.`);
                    return {} as ExpenseResponse;
                }
            }
            else {
                await this.logService.logAction('CreateExpense', `No database instane found.`);
                return {} as ExpenseResponse;
            }
        } catch (error: any) {
            await this.logService.logError('CreateExpense Error', error.message);
            throw error;
        }
    }

    async update<ExpenseResponse>(expense: Expense): Promise<ExpenseResponse> {
        try {
            if (this.database) {
                // const sqlquery: string = `EXECUTE [dbo].[UpdateExpense] 
                //     @ExpenseId = ${expense.ExpenseId}
                //     , @ExpenseDate = '${expense.ExpenseDate}'
                //     , @CompanyId = ${expense.CompanyId}
                //     , @Location = '${expense.Location}'
                //     , @Tax = ${expense.Tax}
                //     , @TaxAmount = ${expense.TaxAmount}
                //     , @SubTotalAmount = ${expense.SubTotalAmount}
                //     , @Discount = ${expense.Discount}
                //     , @NetAmount = ${expense.NetAmount}
                //     , @IsAmountModified = ${expense.IsAmountModified}
                //     , @CreatedBy = ${expense.CreatedBy ?? 1}
                //     , @CreatedDate = '${expense.CreatedDate ?? new Date().toLocaleDateString('en-CA')}'
                //     , @UpdatedBy = ${expense.UpdatedBy ?? 1}
                //     , @UpdatedDate = '${expense.UpdatedDate ?? new Date().toLocaleDateString('en-CA')}'`;
                let createdDate = (expense.CreatedDate ?? new Date().toLocaleDateString('en-CA')).replace("T", " ").replace("Z", "")
                let updatedDate = (expense.UpdatedDate ?? new Date().toLocaleDateString('en-CA')).replace("T", " ").replace("Z", "")
                
                const sqlquery: string = `CALL UpdateExpense(?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
                const params = [expense.ExpenseId, expense.ExpenseDate.replace("T", " ").replace("Z", ""), expense.CompanyId, expense.Location, expense.Tax, expense.TaxAmount,
                    expense.SubTotalAmount, expense.Discount, expense.NetAmount, expense.IsAmountModified, (expense.CreatedBy ?? 1),
                    createdDate, (expense.UpdatedBy ?? 1), updatedDate];
    
                const result: ExpenseResponse[] = await this.database.executeQuery(sqlquery, params);
                if(result) {
                    await this.logService.logAction('UpdateExpense', `Expense updated successfully.`);
                    return result[0];
                }
                else {
                    await this.logService.logAction('UpdateExpense', `No expense updated.`);
                    return {} as ExpenseResponse;
                }
            }
            else {
                await this.logService.logError('UpdateExpense', `No database instane found.`);
                return {} as ExpenseResponse;
            }
        } catch (error: any) {
            await this.logService.logError('UpdateExpense Error', error.message);
            throw error;
        }
    }

    async delete<ExpenseResponse>(id: number): Promise<ExpenseResponse> {
        try {
            if (this.database) {
                // const sqlquery: string = `EXECUTE [dbo].[DeleteExpenseById] @ExpenseId = ${id}`;
                const sqlquery: string = `CALL DeleteExpenseById(?)`;
                const params = [id];
                const result: ExpenseResponse[] = await this.database.executeQuery(sqlquery, params);
                if(result) {
                    await this.logService.logAction('DeleteExpenseById', `Expense deleted successfully.`);
                    return result[0];
                }
                else {
                    await this.logService.logAction('DeleteExpenseById', `No expense deleted.`);
                    return {} as ExpenseResponse;
                }
            }
            else {
                await this.logService.logError('DeleteExpenseById', `No database instane found.`);
                return {} as ExpenseResponse;
            }
        } catch (error: any) {
            await this.logService.logError('DeleteExpenseById Error', error.message);
            throw error;
        }
    }

    async deleteExpenseDetails<ExpenseResponse>(id: number): Promise<ExpenseResponse> {
        try {
            if (this.database) {
                // const sqlquery: string = `EXECUTE [dbo].[DeleteExpenseDetails] @ExpenseId = ${id}`;
                const sqlquery: string = `CALL DeleteExpenseDetails(?)`;
                const params = [id];
                const result: ExpenseResponse[] = await this.database.executeQuery(sqlquery, params);
                if(result) {
                    await this.logService.logAction('DeleteExpenseDetails', `Expense details successfully deleted.`);
                    return result[0];
                }
                else {
                    await this.logService.logAction('DeleteExpenseDetails', `No expense details deleted.`);
                    return {} as ExpenseResponse;
                }
            }
            else {
                await this.logService.logError('DeleteExpenseDetails', `No database instance found.`);
                return {} as ExpenseResponse;
            }
        } catch (error: any) {
            await this.logService.logError('DeleteExpenseDetails Error', error.message);
            throw error;
        }
    }
}
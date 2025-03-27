import { ExpenseItem } from "./expense-item"

export class Expense {
    ExpenseId: number
    ExpenseDate: string
    CompanyId: number
    Location: string
    Tax: number
    TaxAmount: number
    Discount: number
    SubTotalAmount: number
    NetAmount: number
    IsAmountModified?: boolean
    CreatedBy?: number
    CreatedDate?: string
    UpdatedBy?: number
    UpdatedDate?: string
    ExpenseItems?: ExpenseItem[]
    constructor(data: any) { 
		this.ExpenseId = data.ExpenseId;
		this.ExpenseDate = data.ExpenseDate;
		this.CompanyId = data.CompanyId;
		this.Location = data.Location;
		this.Tax = data.Tax;
		this.TaxAmount = data.TaxAmount;
		this.Discount = data.Discount;
		this.SubTotalAmount = data.SubTotalAmount;
		this.NetAmount = data.NetAmount;
		this.IsAmountModified = data.IsAmountModified;
		this.CreatedBy = data.CreatedBy;
		this.CreatedDate = data.CreatedDate;
		this.UpdatedBy = data.UpdatedBy;
		this.UpdatedDate = data.UpdatedDate;
		this.ExpenseItems = data.ExpenseItems;
	}
}
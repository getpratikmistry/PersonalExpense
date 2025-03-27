export class ExpenseItem {
    ExpenseId: number;
    ItemId: number;
    Itemname: string;
    UnitId: number;
    Quantity: number;
    Amount: number;
    PPU: number;
    CreatedBy?: number
    CreatedDate?: string
    UpdatedBy?: number
    UpdatedDate?: string
    Flag: number

    constructor(data: any) {
        this.ExpenseId = data.ExpenseId;
        this.ItemId = data.ItemId;
        this.Itemname = data.ItemName;
        this.UnitId = data.UnitId;
        this.Quantity = data.Quantity;
        this.Amount = data.Amount;
        this.PPU = data.PPU;
		this.CreatedBy = data.CreatedBy;
		this.CreatedDate = data.CreatedDate;
		this.UpdatedBy = data.UpdatedBy;
		this.UpdatedDate = data.UpdatedDate;
		this.Flag = data.Flag;
    }
}

export class ItemHistory {
    ExpenseDate: string;
    Itemname: string;
    PPU: number;
    Quantity: number;
    Amount: number;
    CompanyName: string;
    LB: number;
    KG: number;
    QTY: number;
    LTR: number;

    constructor(data: any) {
        this.ExpenseDate = data.ExpenseDate;
        this.Itemname = data.Itemname;
        this.PPU = data.PPU;
        this.Quantity = data.Quantity;
        this.Amount = data.Amount;
        this.Itemname = data.ItemName;
        this.CompanyName = data.CompanyName;
        this.LB = data.LB;
		this.KG = data.KG;
		this.QTY = data.QTY;
		this.LTR = data.LTR;
    }
}

export interface Expense {
    ExpenseId: number,
    ExpenseDate: string,
    CompanyId: number,
    CompanyName: string,
    Location: string,
    Tax?: number,
    TaxAmount: number,
    Discount: number,
    SubTotalAmount: number,
    NetAmount: number,
    IsAmountModified?: boolean,
    CreatedBy?: number,
    CreatedDate?: string,
    UpdatedBy?: number,
    UpdatedDate?: string,
    ExpenseItems: ExpenseItem[]
}

export interface ExpenseItem {
    ItemId: number,
    ExpenseId: number,
    Itemname: string,
    UnitId: number,
    UnitLabel?: string,
    Quantity: number,
    QuantityLabel?: string,
    Amount: number,
    AmountLabel?: string,
    PPU: number,
    id: string,
    Flag?: number
}

export interface Company {
    CompanyId: number,
    CompanyName: string,
    Location: string
}

export interface selectOptions {
    value: string,
    option: string
}

export interface optionExpenseItems {
    itemName: string
}

export interface optionUnits extends selectOptions {
    displayUnit: string
}

export const UNIT_OPTIONS: optionUnits[] = [
    { option: 'Per lb', value: '1', displayUnit: 'lb' },
    { option: 'Per Kg', value: '2', displayUnit: 'Kg' },
    { option: 'Each', value: '3', displayUnit: 'Qty' },
    { option: 'Per Liter', value: '4', displayUnit: 'L' }
];

export interface ConfigDetails {
    dailyexpenseapipath?: string;
}

export interface UserDetails {
    id?: string,
    firstname?: string,
    lastname?: string,
    email?: string,
}

export interface LoginResponse {
    accessToken?: string,
    refreshToken?: string,
    UserInformation?: UserDetails
}

export interface PriceHistory {
    ExpenseDate: string,
    Itemname: string,
    PPU: number,
    Quantity: number,
    Amount: number,
    CompanyName: string,
    LB: number,
    KG: number,
    QTY: number,
    LTR: number
}

export enum API_STATUS {
    "Success" = "success",
    "Error" = "error"
}

export interface ApiResponse<T> {
    status: 'success' | 'error',
    message: string,
    data?: T | null,
    error?: { code: string; details: string; stackTrace?: string } | null,
    meta?: {
      currentPage: number;
      pageSize: number;
      totalPages: number;
      totalRecords: number;
    }
}
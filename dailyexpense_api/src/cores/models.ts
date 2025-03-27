// Explanation of Fields

import { Company } from "../entities/company";

// status:
// Indicates whether the request was successful or failed.
// Possible values: "success" or "error".

// message:
// Provides additional information about the request outcome.
// For success: a confirmation message.
// For error: a descriptive error message.

// data:
// Contains the actual data returned from the API (e.g., user information, list of items, etc.).
// If the request failed, this is typically an empty object or null.

// error:
// Contains detailed information about the error if the request failed.
// Includes fields like code, details, or stackTrace (for debugging in development).

// meta (Optional):
// Provides additional context, especially for paginated data.
// Common fields: currentPage, pageSize, totalPages, totalRecords.

// timestamp:
// Captures when the response was generated, useful for debugging and logging.
export interface ApiResponse<T> {
    status: 'success' | 'error';
    message: string;
    data: T | null; // Generic type for payload
    error: {
        code: string;
        details: string;
        stackTrace?: string; // Optional for debugging
    } | null;
    meta?: {
        currentPage: number;
        pageSize: number;
        totalPages: number;
        totalRecords: number;
    };
    timestamp: string;
}

export interface IResponse {
    success: boolean;
    message: string;
}

export interface ExpenseResponse extends IResponse {
    NewExpenseId?: number | 0,
    UpdatedExpenseId?: number | 0,
    DeletedExpenseId?: number | 0,
}

export interface ExpenseItemResponse extends IResponse {
    NewItemId?: number | 0,
    UpdatedItemId?: number | 0,
    DeletedItemId?: number | 0,
}

export interface listOptions extends IResponse {
    Locations: string[],
    Items: string[],
    Companies: Company[],
}

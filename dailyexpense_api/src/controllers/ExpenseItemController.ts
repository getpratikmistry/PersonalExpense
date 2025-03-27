import { Request, Response } from "express";
import { createApiResponse } from "../cores/CommonService";
import { ExpenseItemService } from "../use-cases/ExpenseItemService";
import { ExpenseItem } from "../entities/expense-item";
import { ExpenseItemResponse } from "../cores/models";

export class ExpenseItemController {
    constructor(private expenseItemService: ExpenseItemService) { }

    async getbyid(req: Request, res: Response) {
        try {
            const id = parseInt(req.params?.id ?? "0");
            const item: ExpenseItem = await this.expenseItemService.getById(id);
            return res.status(200).json(
                createApiResponse('success', 'Item retrieved successfully.', item)
            );
        } catch (err: any) {
            return res.status(500).json(
                createApiResponse('error', 'Internal server error.', null, { code: 'SERVER_ERROR', details: err.message })
            );
        }
    }
    
    async getAll(req: Request, res: Response) {
        try {
            const items = await this.expenseItemService.GetAll();
            return res.status(200).json(
                createApiResponse('success', 'Items retrieved successfully.', items)
            );
        } catch (err: any) {
            return res.status(500).json(
                createApiResponse('error', 'Internal server error.', null, { code: 'SERVER_ERROR', details: err.message })
            );
        }
    }
    
    async getItemHistory(req: Request, res: Response) {
        try {
            const param: any = req.body;
            const items = await this.expenseItemService.getItemHistory(param.search);
            return res.status(200).json(
                createApiResponse('success', 'Items retrieved successfully.', items)
            );
        } catch (err: any) {
            return res.status(500).json(
                createApiResponse('error', 'Internal server error.', null, { code: 'SERVER_ERROR', details: err.message })
            );
        }
    }

    async create(req: Request, res: Response) {
        try {
            const expense: ExpenseItem = req.body;
            const response: ExpenseItemResponse = await this.expenseItemService.create(expense);
            return res.status(200).json(
                createApiResponse('success', 'Item created successfully.', response)
            );
        } catch (err: any) {
            return res.status(500).json(
                createApiResponse('error', 'Internal server error.', null, { code: 'SERVER_ERROR', details: err.message })
            );
        }
    }

    async update(req: Request, res: Response) {
        try {
            const expense: ExpenseItem = req.body;
            const response: ExpenseItemResponse = await this.expenseItemService.update(expense);
            return res.status(200).json(
                createApiResponse('success', 'Item updated successfully.', response)
            );
        } catch (err: any) {
            return res.status(500).json(
                createApiResponse('error', 'Internal server error.', null, { code: 'SERVER_ERROR', details: err.message })
            );
        }
    }

    async delete(req: Request, res: Response) {
        try {
            const id = parseInt(req.params?.id ?? "0");
            const response: ExpenseItemResponse = await this.expenseItemService.delete(id);
            return res.status(200).json(
                createApiResponse('success', 'Item deleted successfully.', response)
            );
        } catch (err: any) {
            return res.status(500).json(
                createApiResponse('error', 'Internal server error.', null, { code: 'SERVER_ERROR', details: err.message })
            );
        }
    }
}
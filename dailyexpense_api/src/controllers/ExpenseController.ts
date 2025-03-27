import { Request, Response } from "express";
import { ExpenseService } from "../use-cases/ExpenseService";
import { Expense } from "../entities/expense";
import { ExpenseResponse } from "../cores/models";
import { createApiResponse } from "../cores/CommonService";

export class ExpenseController {
    constructor(private expenseService: ExpenseService) { }

    async getAll(req: Request, res: Response) {
        try {
            const expenses = await this.expenseService.GetAll();
            
            return res.status(200).json(
                createApiResponse('success', 'Expenses retrieved successfully.', expenses)
            );
        } catch (err: any) {
            return res.status(500).json(
                createApiResponse('error', 'Internal server error.', null, { code: 'SERVER_ERROR', details: err.message })
            );
        }
    }

    async getbyid(req: Request, res: Response) {
        try {
            const id = parseInt(req.params?.id ?? "0");
            const expenses: Expense = await this.expenseService.GetbyId(id);

            return res.status(200).json(
                createApiResponse('success', 'Expense retrieved successfully.', expenses)
            );
        } catch (err: any) {
            return res.status(500).json(
                createApiResponse('error', 'Internal server error.', null, { code: 'SERVER_ERROR', details: err.message })
            );
        }
    }

    async getLocations(req: Request, res: Response) {
        try {
            const locations = await this.expenseService.GetLocations();
            return res.status(200).json(
                createApiResponse('success', 'Locations retrieved successfully.', locations)
            );
        } catch (err: any) {
            return res.status(500).json(
                createApiResponse('error', 'Internal server error.', null, { code: 'SERVER_ERROR', details: err.message })
            );
        }
    }

    async getDashboardDetails(req: Request, res: Response) {
        try {
            const resultsTemp = await this.expenseService.getDashboardDetails();
            const results = resultsTemp.slice(0, resultsTemp.length - 1);
            return res.status(200).json(
                createApiResponse('success', 'Details retrieved successfully.', results)
            );
        } catch (err: any) {
            return res.status(500).json(
                createApiResponse('error', 'Internal server error.', null, { code: 'SERVER_ERROR', details: err.message })
            );
        }
    }

    async connectionCheck(req: Request, res: Response) {
        try {
            return res.status(200).json(
                createApiResponse('success', 'Connection successfull.')
            );
        } catch (err: any) {
            return res.status(500).json(
                createApiResponse('error', 'Internal server error.', null, { code: 'SERVER_ERROR', details: err.message })
            );
        }
    }

    async create(req: Request, res: Response) {
        try {
            const expense: Expense = req.body;
            const response: ExpenseResponse = await this.expenseService.create(expense);

            return res.status(200).json(
                createApiResponse('success', 'Expense created successfully.', response)
            );
        } catch (err: any) {
            return res.status(500).json(
                createApiResponse('error', 'Internal server error.', null, { code: 'SERVER_ERROR', details: err.message })
            );
        }
    }

    async update(req: Request, res: Response) {
        try {
            const expense: Expense = req.body;
            const response: ExpenseResponse = await this.expenseService.update(expense);

            return res.status(200).json(
                createApiResponse('success', 'Expense updated successfully.', response)
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
            const response: ExpenseResponse = await this.expenseService.deleteExpenseDetails(id);

            return res.status(200).json(
                createApiResponse('success', 'Expense deleted successfully.', response)
            );
        } catch (err: any) {
            return res.status(500).json(
                createApiResponse('error', 'Internal server error.', null, { code: 'SERVER_ERROR', details: err.message })
            );
        }
    }
}
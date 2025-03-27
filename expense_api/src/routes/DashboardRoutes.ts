import { Router, Request, Response } from "express";
import { ExpenseRepository } from "../implementations/ExpenseRepository";
import { ExpenseService } from "../use-cases/ExpenseService";
import { ExpenseController } from "../controllers/ExpenseController";
import { ExpenseItemRepository } from "../implementations/ExpenseItemRepository";

const router = Router();
const expenseRepository = new ExpenseRepository();
const expenseItemRepository = new ExpenseItemRepository();
const expenseService = new ExpenseService(expenseRepository, expenseItemRepository);
const expenseController = new ExpenseController(expenseService);

router.get("/dashboarddetails", (req: Request, res: Response) => {
    expenseController.getDashboardDetails(req, res);
});

router.get("/connectioncheck", (req: Request, res: Response) => {
    expenseController.connectionCheck(req, res);
});

export { router as dashboardRoutes };
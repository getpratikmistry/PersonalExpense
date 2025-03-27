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

router.get("/", (req: Request, res: Response) => {
    expenseController.getAll(req, res);
});

router.get("/locations", (req: Request, res: Response) => {
    expenseController.getLocations(req, res);
});

router.get("/:id", (req: Request, res: Response) => {
    expenseController.getbyid(req, res);
});

router.post("/", (req: Request, res: Response) => {
    expenseController.create(req, res)
});

router.put("/", (req: Request, res: Response) => {
    expenseController.update(req, res);
});

router.delete("/:id", (req: Request, res: Response) => {
    expenseController.delete(req, res);
});

export { router as expenseRoutes };
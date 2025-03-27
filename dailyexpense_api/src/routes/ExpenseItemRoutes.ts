import { Router, Request, Response } from "express";
import { ExpenseItemRepository } from "../implementations/ExpenseItemRepository";
import { ExpenseItemService } from "../use-cases/ExpenseItemService";
import { ExpenseItemController } from "../controllers/ExpenseItemController";

const router = Router();

const expenseItemRepository = new ExpenseItemRepository();
const expenseItemService = new ExpenseItemService(expenseItemRepository);
const expenseItemController = new ExpenseItemController(expenseItemService);

router.get("/expenseitem/itemhistory", (req: Request, res: Response) => {
    expenseItemController.getItemHistory(req, res);
});

router.get("/expenseitem/:id", (req: Request, res: Response) => {
    expenseItemController.getbyid(req, res);
});

router.get("/expenseitem", (req: Request, res: Response) => {
    expenseItemController.getAll(req, res);
});

router.post("/expenseitem", (req: Request, res: Response) => {
    expenseItemController.create(req, res)
});

router.put("/expenseitem", (req: Request, res: Response) => {
    expenseItemController.update(req, res);
});

router.delete("/expenseitem/:id", (req: Request, res: Response) => {
    expenseItemController.delete(req, res);
});

export { router as expenseItemRoutes };
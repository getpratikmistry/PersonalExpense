import { Router, Request, Response } from "express";
import { UserRepository } from "../implementations/UserRepository";
import { UserService } from "../use-cases/UserService";
import { UserController } from "../controllers/UserController";
import { CommonService } from "../cores/CommonService";

const router = Router();
const userRepository = new UserRepository();
const commonService = new CommonService();
const userService = new UserService(userRepository);
const userController = new UserController(userService, commonService);

router.post("/login", (req: Request, res: Response) => {
    userController.findUser(req, res)
});

router.post("/refresh", (req: Request, res: Response) => {
    commonService.refreshToken(req, res);    
});

export { router as openRoutes };
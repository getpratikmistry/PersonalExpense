import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { createApiResponse } from "../cores/CommonService";

// Extend the Express Request interface to include `user`
declare global {
    namespace Express {
        interface Request {
            user?: string | jwt.JwtPayload; // Update type based on your token structure
        }
    }
}

export const verifyTokenMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'] ?? "";
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json(createApiResponse('error', "Access token is missing or invalid"));
        return
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY as string);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(403).json(createApiResponse('error', "Token is invalid or expired"));
        return;
    }
};

export default verifyTokenMiddleware;

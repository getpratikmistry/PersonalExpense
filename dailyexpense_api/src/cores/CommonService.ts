import { ApiResponse } from "./models";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { UserDetails } from "../entities/userdetails";
import { Request, Response } from "express";

dotenv.config();

// Utility function to create a response
export const createApiResponse = <T>(
    status: 'success' | 'error',
    message: string,
    data: T | null = null,
    error: { code: string; details: string; stackTrace?: string } | null = null,
    meta?: {
      currentPage: number;
      pageSize: number;
      totalPages: number;
      totalRecords: number;
    }
  ): ApiResponse<T> => {
    return {
      status,
      message,
      data,
      error,
      meta,
      timestamp: new Date().toISOString()
    };
  };

export class CommonService {

    constructor() {
     }

    generateAuthToken(user: UserDetails): string {
        const key = process.env.ACCESS_TOKEN_KEY as string ?? "YOUR_KEY";
        const life = process.env.ACCESS_TOKEN_LIFESPAN as string ?? "YOUR_KEY";
        const token = jwt.sign({
            id: user.UserId,
            firstname: user.Firstname,
            lastname: user.Lastname,
            email: user.Email
        }, key, {
            expiresIn: life,
            algorithm: "HS256"
        });
        return token;
    }

    generateRefreshToken(user: UserDetails): string {
        const key = process.env.REFRESH_TOKEN_KEY as string ?? "YOUR_KEY";
        const life = process.env.REFRESH_TOKEN_LIFESPAN as string ?? "YOUR_KEY";
        const token = jwt.sign({
            id: user.UserId,
            firstname: user.Firstname,
            lastname: user.Lastname,
            email: user.Email
        }, key, {
            expiresIn: life,
            algorithm: "HS256"
        });
        return token;
    }

    refreshToken(req: Request, res: Response) {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json(
                createApiResponse('error', 'Refresh token required')
            );
        }
        // if (!refreshTokens.includes(refreshToken)) return res.status(403).json({ message: 'Invalid refresh token' });

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY ?? "YOUR_KEY", (err: any, user: any) => {
            if (err) return res.status(403).json(
                createApiResponse('error', 'Invalid refresh token.')
            );

            // Generate new tokens
            const newAccessToken = this.generateAuthToken(user);
            const newRefreshToken = this.generateRefreshToken(user);

            // Replace the old refresh token
            // refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
            // refreshTokens.push(newRefreshToken);

            return res.status(200).json(
                createApiResponse('error', 'Refresh token generated', {
                    "accessToken": newAccessToken,
                    "refreshToken": newRefreshToken,
                    "userInformation": user
                })
            );
        });
    }
}
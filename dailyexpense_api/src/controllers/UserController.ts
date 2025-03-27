import { Request, Response } from "express";
import { CommonService, createApiResponse } from "../cores/CommonService";
import { UserService } from "../use-cases/UserService";
import { LoginRequest, LoginResponse, UserDetails } from "../entities/userdetails";

export class UserController {
    constructor(private userService: UserService, private commonService: CommonService) { }

    async findUser(req: Request, res: Response) {
        try {
            const user: LoginRequest = req.body;
            const userdetails: UserDetails = await this.userService.findUser(user.Username, user.Password);

            if (userdetails && userdetails.UserId > 0) {
                const acctoken = this.commonService.generateAuthToken(userdetails);
                const reftoken = this.commonService.generateRefreshToken(userdetails);

                const loginResponse: LoginResponse = { 
                    id: userdetails.UserId, 
                    firstname: userdetails.Firstname, 
                    lastname: userdetails.Lastname, 
                    email: userdetails.Email
                };
    
                return res.status(200).json(
                    createApiResponse('success', 'User retrieved successfully.', {
                        "accessToken": acctoken,
                        "refreshToken": reftoken,
                        "userInformation": loginResponse
                    })
                );
            }

            return res.status(200).json(
                createApiResponse('error', 'User not found.')
            );
        } catch (err: any) {
            return res.status(500).json(
                createApiResponse('error', 'Internal server error.', null, { code: 'SERVER_ERROR', details: err.message })
            );
        }
    }
}
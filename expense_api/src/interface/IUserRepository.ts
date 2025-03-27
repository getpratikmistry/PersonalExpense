import { UserDetails } from "../entities/userdetails";

export interface IUserRepository {
    findUser(username: string, Password: string): Promise<UserDetails>;
}
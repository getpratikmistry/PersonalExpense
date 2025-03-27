import { UserDetails } from "../entities/userdetails";
import { IUserRepository } from "../interface/IUserRepository";

export class UserService {
    constructor(private userRepository: IUserRepository) { }

    async findUser(username: string, Password: string): Promise<UserDetails> {
        return await this.userRepository.findUser(username, Password);
    }
}
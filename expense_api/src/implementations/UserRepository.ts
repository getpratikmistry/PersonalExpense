import { IUserRepository } from "../interface/IUserRepository";
import { MariaDatabase } from "../mariadb";

export class UserRepository implements IUserRepository {
    private database?: MariaDatabase;

    constructor() {
        this.database = new MariaDatabase();
    }

    async findUser<UserDetails>(username: string, Password: string): Promise<UserDetails> {
        if (this.database) {
            const sqlquery: string = `CALL GetUserForLogin(?, ?)`;
            const params = [username, Password];

            const result: UserDetails[] = await this.database.executeQuery(sqlquery, params);
            if(result) {
                return result[0];
            }
            else {
                return {} as UserDetails;
            }
        }
        else {
            return {} as UserDetails;
        }
    }
}
import { MariaDatabase } from "../mariadb";

export class LogService {
    private database: MariaDatabase;

    constructor() {
        this.database = new MariaDatabase();
    }

    async logError(message: string, details: string) {
        const sqlquery = `INSERT INTO Logs (Type, Message, Details, Timestamp) VALUES (?, ?, ?, NOW())`;
        const params = ['Error', message, details];
        await this.database.executeQuery(sqlquery, params);
    }

    async logAction(message: string, details: string) {
        const sqlquery = `INSERT INTO Logs (Type, Message, Details, Timestamp) VALUES (?, ?, ?, NOW())`;
        const params = ['Action', message, details];
        await this.database.executeQuery(sqlquery, params);
    }
}
import sql, { config, ConnectionPool, IResult } from "mssql";

let database = null;

export interface Result<T> {
    success: boolean;
    data?: T;
    message?: string;
}

export default class Database {
    private config: config;
    private poolconnection: ConnectionPool | null = null;  // Explicitly declare type as ConnectionPool | null
    private connected: boolean = false;

    constructor(config: config) {
        this.config = config;
    }

    async connect() {
        try {
            this.poolconnection = await sql.connect(this.config);
            this.connected = true;
            return this.poolconnection;
        } catch (error) {
            console.error("Error connecting to the database:", error);
            this.connected = false;
        }
    }

    isConnected(): boolean { return this.connected; }

    async disconnect() {
        try {
            if (this.connected && this.poolconnection) {
                await this.poolconnection.close();
                this.connected = false;
            }
        } catch (error) {
            console.error("Error disconnecting from the database:", error);
        }
    }

    async executeQuery(query: string) {
        try {
            if (this.connected && this.poolconnection) {
                const request = this.poolconnection.request();
                const result = await request.query(query);

                return { success: true, data: result.recordset };
            } else {
                return { success: false, message: 'Not connected' };
            }
        } catch (error) {
            console.error("Error executing query:", error);
            return {success: false, message: 'Database query failed'};
        }
    }
}

export const createDatabaseConnection = async (passwordConfig: any) => {
    database = new Database(passwordConfig);
    await database.connect();
    return database;
};

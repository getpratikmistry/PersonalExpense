import mariadb, { Pool, PoolConnection, QueryOptions } from "mariadb";
import { configMARIADB } from "./cores/constants";

export class MariaDatabase {
    private pool: Pool;

    constructor() {
        this.pool = mariadb.createPool(configMARIADB);
    }

    // Generic method to execute queries
    public async executeQuery<T>(query: string, params: any[] = []): Promise<T> {
        let connection: PoolConnection | null = null;
        try {
            connection = await this.pool.getConnection();
            const qo: QueryOptions = {
                sql: query,
                decimalAsNumber: true,
                bigIntAsNumber: true
            }
            const result = await connection.query(qo, params);
            return result[0] as T;
        } catch (err) {
            console.error('Database query error:', err);
            return err as T;
        } finally {
            if (connection) connection.release();
        }
    }

    // Generic method to execute queries
    public async executeMultipleQuery(query: string, params: any[] = []) {
        let connection: PoolConnection | null = null;
        try {
            connection = await this.pool.getConnection();
            const qo: QueryOptions = {
                sql: query,
                decimalAsNumber: true,
                bigIntAsNumber: true
            }
            const result = await connection.query(qo, params);
            return result;
        } catch (err) {
            console.error('Database query error:', err);
            return err;
        } finally {
            if (connection) connection.release();
        }
    }

    // Close the connection pool
    public async closePool(): Promise<void> {
        try {
            await this.pool.end();
        } catch (err) {
            console.error('Error closing connection pool:', err);
        }
    }

    IsConnected(): boolean {
        return this.pool ? true : false;
    }

    async getConnection() {
        return await this.pool.getConnection();
    }

    async beginTransaction(conn: mariadb.Connection) {
        await conn.beginTransaction();
    }

    async commit(conn: mariadb.Connection) {
        await conn.commit();
    }

    async rollback(conn: mariadb.Connection) {
        await conn.rollback();
    }
}
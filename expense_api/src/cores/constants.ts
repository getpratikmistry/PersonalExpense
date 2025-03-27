import { config } from "mssql";
import dotenv from "dotenv"
import mariadb from "mariadb";

// const environment = process.env.NODE_ENV || 'development';
// dotenv.config({ path: `.env.${environment}` });
// console.log(environment);
dotenv.config();

export const configMSSQL: config = {
    server: process.env.DB_SERVER ?? "",
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD ,
    port: parseInt(process.env.DB_PORT ?? "1426"),
    options: {
        trustedConnection: true,
        enableArithAbort: true,
        trustServerCertificate: true,
    },
};

export const configMARIADB: mariadb.PoolConfig = {
    host: process.env.DB_SERVER_MARIADB ?? "",
    database: process.env.DB_NAME_MARIADB,
    user: process.env.DB_USER_MARIADB,
    password: process.env.DB_PASSWORD_MARIADB ,
    port: parseInt(process.env.DB_PORT_MARIADB ?? "3306")
};

export const APP_PORT = process.env.APP_PORT
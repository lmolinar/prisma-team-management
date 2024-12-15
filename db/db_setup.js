import pg from "pg";
import * as dotenv from "dotenv";
import { getSqlAsString } from "./helpers.js";

const { Client, Pool } = pg;
dotenv.config({});

const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_HOST = process.env.DB_HOST;
const DB_PASSWORD = process.env.DB_PASSWORD;

let client;

async function setupDatabase() {
    const isDev = process.env.NODE_ENV === "development";

    if (!isDev) return console.log("in production environment - skipping database creation.");

    client = new Client({
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD,
        port: 5432,
    });

    await client.connect();

    const res = await client.query(`SELECT datname FROM pg_catalog.pg_database WHERE datname = '${DB_NAME}'`);

    if (res.rowCount === 0) {
        console.log(`${DB_NAME} database not found, creating it.`);
        await client.query(`CREATE DATABASE "${DB_NAME}";`);

        console.log(`created database ${DB_NAME}.`);

        const pool = new Pool({
            database: DB_NAME,
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASSWORD,
            port: 5432,
        });
        const createTablesQuery = getSqlAsString("/db_setup.sql");
        await pool.query(createTablesQuery);
        console.log("Tables created");

        const insertRandomDataQuery = getSqlAsString("/db_data.sql");

        await pool.query(insertRandomDataQuery);
        console.log("Mock data created");

        pool.end();
    } else {
        console.log(`${DB_NAME} database already exists.`);
    }

    await client.end();
}

setupDatabase();

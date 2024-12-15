import pg from "pg";
const { Pool } = pg;

// Create a new pool of database connections
export const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // Use an environment variable for the database URL
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

// Close the pool when the app shuts down
process.on("SIGINT", () => pool.end());
process.on("SIGTERM", () => pool.end());

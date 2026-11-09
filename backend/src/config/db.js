import pg from "pg";
const { Pool } = pg;
if (!process.env.DATABASE_URL) console.warn("DATABASE_URL is not configured");
export const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 10, idleTimeoutMillis: 30000, connectionTimeoutMillis: 10000, ssl: process.env.PGSSL === "true" ? { rejectUnauthorized: false } : undefined });
pool.on("error", (err) => console.error("Unexpected PostgreSQL pool error", err));

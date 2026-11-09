import "dotenv/config";
import { pool } from "./config/db.js";

try {
  const result = await pool.query("SELECT NOW() AS current_time");
  console.log("Supabase connected successfully!");
  console.log(result.rows[0]);
} catch (error) {
  console.error("Connection failed:", error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
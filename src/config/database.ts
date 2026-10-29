import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function testConnection(): Promise<void> {
  await pool.query("SELECT 1");
  console.log("PostgreSQL connected successfully");
}

export default pool;

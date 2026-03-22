import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import "dotenv/config";

/*
I used a Pool from the pg library to manage multiple connections efficiently. 
Then, I connected Drizzle to this pool. I keep the database URL in a .env file for security.
*/

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool);

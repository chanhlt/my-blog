// lib/db/index.ts
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Tránh tạo nhiều connection khi hot-reload trong development
const globalForDb = globalThis as unknown as {
  _db: ReturnType<typeof drizzle> | undefined;
  _sql: ReturnType<typeof postgres> | undefined;
};

function createDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  const sql = postgres(process.env.DATABASE_URL, {
    max: 10, // kích thước connection pool
  });

  return drizzle(sql, { schema });
}

export const db =
  globalForDb._db ?? (globalForDb._db = createDb());

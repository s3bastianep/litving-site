import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

type GlobalDb = {
  __litvingPgPool?: pg.Pool;
  __litvingDbReady?: Promise<void>;
};

const g = globalThis as typeof globalThis & GlobalDb;

export function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL?.trim());
}

function getPool() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    throw new Error("DATABASE_URL is not set.");
  }
  if (!g.__litvingPgPool) {
    g.__litvingPgPool = new pg.Pool({
      connectionString: url,
      // Private Railway / local: no SSL. Public proxy URLs often need SSL.
      ssl:
        /localhost|127\.0\.0\.1|\.railway\.internal/i.test(url) || url.includes("sslmode=disable")
          ? false
          : { rejectUnauthorized: false },
    });
  }
  return g.__litvingPgPool;
}

export function getDb() {
  return drizzle(getPool(), { schema });
}

/** Create table once per process when using Postgres. */
export async function ensureListingsTable() {
  if (!hasDatabaseUrl()) return;
  if (!g.__litvingDbReady) {
    g.__litvingDbReady = (async () => {
      const pool = getPool();
      await pool.query(`
        CREATE TABLE IF NOT EXISTS listings (
          id TEXT PRIMARY KEY,
          code TEXT NOT NULL,
          operation TEXT NOT NULL,
          kind TEXT NOT NULL,
          zone TEXT NOT NULL,
          city TEXT NOT NULL,
          address TEXT NOT NULL DEFAULT '',
          building_name TEXT,
          sale_details JSONB,
          price_value INTEGER NOT NULL,
          price_label TEXT NOT NULL,
          admin_fee_value INTEGER,
          admin_fee TEXT,
          price_note TEXT,
          area_m2 INTEGER NOT NULL,
          area TEXT NOT NULL,
          rooms INTEGER NOT NULL DEFAULT 0,
          baths INTEGER NOT NULL DEFAULT 0,
          parking INTEGER NOT NULL DEFAULT 0,
          floor TEXT,
          pets BOOLEAN NOT NULL DEFAULT FALSE,
          furnished BOOLEAN NOT NULL DEFAULT FALSE,
          elevator BOOLEAN NOT NULL DEFAULT TRUE,
          stratum TEXT,
          status TEXT NOT NULL DEFAULT 'disponible',
          published BOOLEAN NOT NULL DEFAULT TRUE,
          image TEXT NOT NULL,
          gallery JSONB NOT NULL DEFAULT '[]'::jsonb,
          lat DOUBLE PRECISION NOT NULL,
          lng DOUBLE PRECISION NOT NULL,
          description TEXT NOT NULL DEFAULT '',
          amenities JSONB NOT NULL DEFAULT '[]'::jsonb,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );
      `);
      await pool.query(`
        ALTER TABLE listings ADD COLUMN IF NOT EXISTS building_name TEXT;
      `);
      await pool.query(`
        ALTER TABLE listings ADD COLUMN IF NOT EXISTS sale_details JSONB;
      `);
    })();
  }
  await g.__litvingDbReady;
}

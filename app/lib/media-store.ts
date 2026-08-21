import { getPool, hasDatabaseUrl, ensureListingsTable } from "../../db";

type GlobalMedia = {
  __litvingMediaReady?: Promise<void>;
};

const g = globalThis as typeof globalThis & GlobalMedia;

export async function ensureMediaTable() {
  if (!hasDatabaseUrl()) return;
  await ensureListingsTable();
  if (!g.__litvingMediaReady) {
    g.__litvingMediaReady = (async () => {
      const pool = getPool();
      await pool.query(`
        CREATE TABLE IF NOT EXISTS media_assets (
          id TEXT PRIMARY KEY,
          content_type TEXT NOT NULL,
          bytes BYTEA NOT NULL,
          created_at TEXT NOT NULL
        );
      `);
    })();
  }
  await g.__litvingMediaReady;
}

export async function saveMediaAsset(input: {
  id: string;
  contentType: string;
  bytes: Buffer;
}) {
  await ensureMediaTable();
  const pool = getPool();
  await pool.query(
    `INSERT INTO media_assets (id, content_type, bytes, created_at)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (id) DO UPDATE SET content_type = EXCLUDED.content_type, bytes = EXCLUDED.bytes`,
    [input.id, input.contentType, input.bytes, new Date().toISOString()],
  );
}

export async function getMediaAsset(id: string) {
  if (!hasDatabaseUrl()) return null;
  await ensureMediaTable();
  const pool = getPool();
  const result = await pool.query<{ content_type: string; bytes: Buffer }>(
    `SELECT content_type, bytes FROM media_assets WHERE id = $1 LIMIT 1`,
    [id],
  );
  const row = result.rows[0];
  if (!row) return null;
  return { contentType: row.content_type, bytes: row.bytes };
}

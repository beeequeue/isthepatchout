import type { DatabaseSync } from "node:sqlite"

import { log } from "evlog"

const migrations = import.meta.glob("./migrations/*.sql", {
  eager: true,
  query: "?raw",
  import: "default",
})

export function migrate(db: DatabaseSync) {
  log.info("migrations", "Starting DB migrations...")

  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA wal_autocheckpoint = 1000;
  `)
  db.exec(`
    CREATE TABLE IF NOT EXISTS migrations (
      name TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)

  const rows = db.prepare("SELECT name FROM migrations").all() as Array<{ name: string }>
  const applied = new Set(rows.map((row) => row.name))
  const recordMigration = db.prepare("INSERT INTO migrations (name) VALUES (?)")

  for (const [file, sql] of Object.entries(migrations)) {
    if (applied.has(file)) continue

    log.info("migrations", `Applying ${file}...`)

    try {
      db.exec("BEGIN IMMEDIATE")
      db.exec(sql)
      recordMigration.run(file)
      db.exec("COMMIT")

      log.info("migrations", `Applied ${file}`)
    } catch (error) {
      try {
        db.exec("ROLLBACK")
      } catch {}
      log.error("migrations", `Migration ${file} failed: ${(error as Error).message}`)
      throw new Error(`Migration failed: ${file}`, { cause: error })
    }
  }

  log.info("migrations", "Migrations are up to date.")
}

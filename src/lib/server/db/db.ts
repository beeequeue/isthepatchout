import fs from "node:fs"
import { DatabaseSync } from "node:sqlite"

import { migrate } from "./migration.ts"

fs.mkdirSync(".data", { recursive: true })
export const db = new DatabaseSync(".data/db.sqlite")

migrate(db)

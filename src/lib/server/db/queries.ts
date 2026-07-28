import { dedent } from "strip-indent"

import { db } from "./db.ts"

export const $subscription = {
  exists: db.prepare(
    dedent(`
      SELECT 1 FROM subscriptions WHERE endpoint = ? LIMIT 1;
    `),
  ),
  delete: db.prepare(
    dedent(`
      DELETE FROM subscriptions WHERE endpoint = ? RETURNING endpoint;
    `),
  ),
  upsert: db.prepare(
    dedent(`
      INSERT INTO subscriptions
        (type, endpoint, auth, extra, environment, "lastNotified", "createdAt")
      VALUES (?, ?, ?, ?, ?, (SELECT COALESCE(MAX(number), 0) FROM patches), ?)
      ON CONFLICT(endpoint) DO UPDATE SET auth  = excluded.auth,
                                          extra = excluded.extra

    `),
  ),
} as const

export const $patch = {
  exists: db.prepare(
    dedent(`
      SELECT 1 FROM patches WHERE id = ? LIMIT 1;
    `),
  ),
  getLatest: db.prepare(
    dedent(`
      SELECT * FROM patches ORDER BY number DESC LIMIT 1;
    `),
  ),
  upsert: db.prepare(
    dedent(`
      INSERT INTO patches
        (id, number, releasedAt, links)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET releasedAt = excluded.releasedAt,
                                    links = excluded.links
    `),
  ),
} as const

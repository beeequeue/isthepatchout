CREATE TABLE patches
(
  "id"         TEXT    NOT NULL PRIMARY KEY,
  "number"     INTEGER NOT NULL,
  "releasedAt" TIMESTAMP,
  "links"      BLOB -- json string array
) WITHOUT ROWID;

CREATE INDEX "patches_releasedAt_idx" ON patches ("releasedAt");

CREATE TABLE subscriptions
(
  "type"         TEXT DEFAULT 'push'       NOT NULL,
  "endpoint"     TEXT PRIMARY KEY,
  "auth"         TEXT                      NOT NULL,
  "extra"        TEXT,
  "environment"  TEXT                      NOT NULL,
  "lastNotified" INTEGER                   NOT NULL,
  "createdAt"    TEXT DEFAULT CURRENT_DATE NOT NULL
);

CREATE INDEX sub_env_notified_idx ON subscriptions ("environment", "lastNotified");

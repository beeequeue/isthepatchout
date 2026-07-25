import { afterAll, beforeEach, describe, expect, it, vi } from "vitest"

import type { Patch } from "#/types.ts"
import { db } from "#lib/server/db/db.ts"
import { $patch } from "#lib/server/db/queries.ts"
import { getPatchList } from "#lib/server/dota.ts"
import { announcePatch } from "#lib/server/patch-iterator.ts"

import { checkForNewPatches } from "./patches.ts"

vi.mock("#lib/server/dota.ts")
const mockedGetPatchList = vi.mocked(getPatchList)

vi.mock("#lib/server/db/db.ts", async () => {
  const { DatabaseSync } = await import("node:sqlite")
  const { migrate } = await import("#lib/server/db/migration.ts")
  const db = new DatabaseSync(":memory:")
  migrate(db)

  return { db }
})

vi.mock("#lib/server/patch-iterator.ts")
const mockedAnnouncePatch = vi.mocked(announcePatch)

const patches: Patch[] = [
  {
    id: "7.38",
    links: ["https://dota2.com/patches/7.38"],
    number: 738,
    releasedAt: "2025-02-19T00:00:00.000Z",
  },
  {
    id: "7.39",
    links: ["https://dota2.com/patches/7.39"],
    number: 739,
    releasedAt: null,
  },
]

describe("checkForNewPatches", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    db.exec("DELETE FROM patches")
  })

  afterAll(() => {
    db.close()
  })

  it("persists and announces patches that are not in the database", async () => {
    mockedGetPatchList.mockResolvedValue(patches)
    $patch.upsert.run(
      patches[0]!.id,
      patches[0]!.number,
      patches[0]!.releasedAt,
      JSON.stringify(patches[0]!.links),
    )

    await checkForNewPatches()

    expect(db.prepare("SELECT * FROM patches ORDER BY number").all()).toEqual([
      {
        id: "7.38",
        links: JSON.stringify(["https://dota2.com/patches/7.38"]),
        number: 738,
        releasedAt: "2025-02-19T00:00:00.000Z",
      },
      {
        id: "7.39",
        links: JSON.stringify(["https://dota2.com/patches/7.39"]),
        number: 739,
        releasedAt: null,
      },
    ])
    expect(mockedAnnouncePatch).toHaveBeenCalledOnce()
    expect(mockedAnnouncePatch).toHaveBeenCalledWith(patches[1])
  })

  it("does nothing when every fetched patch is already stored", async () => {
    mockedGetPatchList.mockResolvedValue(patches)
    for (const patch of patches) {
      $patch.upsert.run(patch.id, patch.number, patch.releasedAt, JSON.stringify(patch.links))
    }

    await checkForNewPatches()

    expect(db.prepare("SELECT COUNT(*) AS count FROM patches").get()).toEqual({ count: 2 })
    expect(mockedAnnouncePatch).not.toHaveBeenCalled()
  })

  it("fails when the patch list cannot be fetched", async () => {
    mockedGetPatchList.mockResolvedValue(null)

    await expect(checkForNewPatches()).rejects.toThrow("Failed to fetch patches.")
    expect(db.prepare("SELECT COUNT(*) AS count FROM patches").get()).toEqual({ count: 0 })
  })

  it("only announces the latest patch in list", async () => {
    const patches: Patch[] = [
      {
        id: "7.38",
        links: ["https://dota2.com/patches/7.38"],
        number: 7380,
        releasedAt: "2025-02-19T00:00:00.000Z",
      },
      {
        id: "7.39",
        links: ["https://dota2.com/patches/7.39"],
        number: 7390,
        releasedAt: "2025-05-19T00:00:00.000Z",
      },
      {
        id: "7.38b",
        links: ["https://dota2.com/patches/7.38a"],
        number: 7382,
        releasedAt: "2025-03-19T00:00:00.000Z",
      },
    ]
    mockedGetPatchList.mockResolvedValue(patches)

    await checkForNewPatches()
    expect(mockedAnnouncePatch).toHaveBeenCalledExactlyOnceWith(patches[1])
  })
})

import { $patch } from "#lib/server/db/queries.ts"
import { getPatchList } from "#lib/server/dota.ts"
import { announcePatch } from "#lib/server/patch-iterator.ts"

export async function checkForNewPatches() {
  const patches = await getPatchList()
  if (patches == null) throw new Error("Failed to fetch patches.")

  const sortedPatches = patches.toSorted((a, b) => a.number - b.number)
  const latest = sortedPatches.at(-1)!

  for (const patch of sortedPatches) {
    if ($patch.exists.get(patch.id) != null) continue

    $patch.upsert.run(patch.id, patch.number, patch.releasedAt, JSON.stringify(patch.links))

    if (patch === latest) {
      announcePatch(patch)
    }
  }
}

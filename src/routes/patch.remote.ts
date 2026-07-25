import { useLogger } from "evlog/sveltekit"

import type { Patch } from "#/types.ts"
import { $patch } from "#lib/server/db/queries.ts"
import { getPatchFeedIterator } from "#lib/server/patch-iterator.ts"
import { query } from "$app/server"

export const getLatestPatch = query<Patch | null>(() => {
  const patch = $patch.getLatest.get() as Patch | undefined
  useLogger().set({ patch: patch?.id ?? "null" })

  return patch ?? null
})

export const subscribeToPatchData = query.live<Patch>((): AsyncIterator<Patch> => {
  return getPatchFeedIterator()
})

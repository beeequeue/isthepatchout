import { Temporal } from "temporal-polyfill"

import type { Patch } from "~~/lib/types"

export const isRecentlyReleased = (patch: Patch | null | undefined): boolean => {
  if (patch == null) return false

  const now = Temporal.Now.plainDateISO()
  const releasedAt = Temporal.PlainDateTime.from(patch.releasedAt!)
  const between = releasedAt.until(now, { smallestUnit: "hour" })
  return between.days < 7
}

import type { Patch } from "~~/lib/types"

if (!("Temporal" in globalThis)) {
  await import("temporal-polyfill-lite/global")
}

export const isRecentlyReleased = (patch: Patch | null | undefined): boolean => {
  if (patch == null) return false

  const now = Temporal.Now.plainDateISO()
  const releasedAt = Temporal.PlainDateTime.from(patch.releasedAt!)
  const between = releasedAt.until(now, { smallestUnit: "hour" })
  return between.days < 7
}

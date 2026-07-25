import type { Patch } from "#/types.ts"

const isRecentlyReleased = (releasedAtString: string | null | undefined): boolean => {
  if (releasedAtString == null) return false

  const now = Temporal.Now.instant()
  const releasedAt = Temporal.Instant.from(releasedAtString)
  const days = releasedAt
    .until(now)
    .total({ unit: "days", relativeTo: Temporal.Now.plainDateISO() })
  return days < 7
}

let patch = $state<Patch>()

let releasedBeforeOpening = $state(false)

const recentlyReleased = $derived(isRecentlyReleased(patch?.releasedAt))

// svelte-ignore state_referenced_locally
let current = $state(recentlyReleased)

export const usePatch = () =>
  ({
    get patch() {
      return patch
    },
    get recentlyReleased() {
      return recentlyReleased
    },
    get releasedBeforeOpening() {
      return releasedBeforeOpening
    },
    set(incoming: Patch) {
      patch = incoming
    },
    setReleasedBeforeOpening(incoming: boolean) {
      releasedBeforeOpening = incoming
    },
    setRel() {
      releasedBeforeOpening = false
      current = !current
      patch = {
        ...(patch as Required<Patch>),
        releasedAt: current ? Temporal.Now.instant().toString() : "2026-06-01T12:00:00Z",
      }
    },
  }) as const

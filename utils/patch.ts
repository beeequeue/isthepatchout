import { differenceInDays } from "date-fns"

import { Patch } from "~/lib/types"

export const isRecentlyReleased = (patch: Patch | null | undefined) =>
  patch != null && differenceInDays(Date.now(), new Date(patch.releasedAt!)) < 7

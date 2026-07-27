import { Cron } from "croner"
import { log } from "evlog"

import { checkForNewPatches } from "#lib/server/patches.ts"

declare global {
  // eslint-disable-next-line vars-on-top
  var jobs: { [key in "checkJob"]?: Cron }
}

globalThis.jobs ??= {}
// clean up instance from the previous module evaluation
globalThis.jobs.checkJob?.stop()

globalThis.jobs.checkJob = new Cron(
  "*/2 * * * * *",
  async () => {
    log.debug("cron:check", "Checking for patches...")

    await checkForNewPatches()
  },
  { alternativeWeekdays: true },
)

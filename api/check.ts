import { forbidden, internal } from "@hapi/boom"

import { getPatchList } from "./_dota"
import { CustomHandler, sentryWrapper } from "./_sentry"
import { formatPatchData, upsertPatches } from "./_supabase"

const { CHECK_TOKEN } = process.env

const checkAndUpdatePatches = async () => {
  const releasedPatches = await getPatchList()

  if (releasedPatches == null) {
    throw new Error("Could not get patches")
  }

  const formattedPatches = releasedPatches.map(formatPatchData)
  await upsertPatches(formattedPatches)
}

/**
 * GET /api/check
 * When an authenticated request comes through we get the two possible
 * upcoming patches (letter and minor) and check if they are out.
 *
 * If a new patch is released, we update it with `released: true`, new links,
 * and add new patches to check in the future.
 */
const handler: CustomHandler = async (request) => {
  if (CHECK_TOKEN == null || request.headers.authorization !== `Bearer ${CHECK_TOKEN}`) {
    return forbidden()
  }

  try {
    await checkAndUpdatePatches()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return internal((error as Error).message, error)
  }
}

export default sentryWrapper("/check", handler)

import { defineEventHandler, getHeader, H3Event } from "h3"
import { serverSupabase } from "~/server/composables/supabase"

import { formatPatchData, okResponse } from "../utils"
import { getPatchList } from "../utils/dota"

const config = useRuntimeConfig()
const authorizationHeader = `Bearer ${config.checkToken}` as const

const checkAndUpdatePatches = async (event: H3Event) => {
  const releasedPatches = await getPatchList()

  if (releasedPatches == null) {
    throw new Error("Could not get patches")
  }

  const formattedPatches = releasedPatches.map(formatPatchData)

  const { upsertPatches } = serverSupabase(event)
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
export default defineEventHandler(async (event) => {
  if (
    config.checkToken == null ||
    getHeader(event, "authorization") !== authorizationHeader
  ) {
    throw createError({ statusCode: 403 })
  }

  try {
    await checkAndUpdatePatches(event)

    return okResponse
  } catch (error: unknown) {
    throw createError({ cause: error })
  }
})

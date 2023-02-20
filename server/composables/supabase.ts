import { serverSupabaseServiceRole } from "#supabase/server"
import { H3Event } from "h3"

import { Database, Patch } from "~/lib/types"
import { Logger } from "~/server/utils/logger"

export const serverSupabase = (event: H3Event) => {
  const supabase = serverSupabaseServiceRole<Database>(event)

  const upsertPatches = async (patches: Patch[]) => {
    Logger.info(`Received ${patches.length} patches to maybe insert...`)

    const { data: knownPatches, error: knownPatchesError } = await supabase
      .from("patches")
      .select("id")
    if (knownPatchesError != null) {
      Logger.error(knownPatchesError)
      throw new Error(knownPatchesError.message)
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const knownPatchIds = new Set(knownPatches!.map((patch) => patch.id))
    const newPatches = patches.filter((patch) => !knownPatchIds.has(patch.id))

    Logger.info(`Of which ${newPatches.length} are new...`)
    if (newPatches.length === 0) return

    const { error } = await supabase.from("patches").insert(newPatches)

    if (error) {
      Logger.error(error)
      throw new Error(error.message)
    }
  }

  return { upsertPatches }
}

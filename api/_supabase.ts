import { SupabaseClient } from "@supabase/supabase-js"

import type { Patch } from "../src/types"

import type { PatchNoteListItem } from "./_dota"
import { DotaVersion } from "./_dota"
import { Logger } from "./_logger"

const { SUPABASE_SERVICE_KEY, VITE_SUPABASE_URL } = process.env

export const supabase = new SupabaseClient(
  VITE_SUPABASE_URL as string,
  SUPABASE_SERVICE_KEY as string,
)

export const formatPatchData = (data: PatchNoteListItem): Patch => {
  const links = [`https://dota2.com/patches/${data.patch_number}`]

  if (data.patch_website != null) {
    links.push(`https://dota2.com/${data.patch_website}`)
  }

  return {
    id: data.patch_number,
    number: new DotaVersion(data.patch_number).toNumber(),
    releasedAt: new Date(data.patch_timestamp * 1000).toISOString(),
    links,
  }
}

export const upsertPatches = async (patches: Patch[]) => {
  Logger.info(`Inserting or updating ${patches.length} patches...`)

  const { error } = await supabase.from<Patch>("patches").upsert(patches)

  if (error) {
    Logger.error(error)
    throw new Error(error.message)
  }
}

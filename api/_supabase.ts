import { SupabaseClient } from "@supabase/supabase-js"

import type { Patch } from "../src/types"

import type { PatchData } from "./_dota"
import { Logger } from "./_logger"

const { SUPABASE_SERVICE_KEY, VITE_SUPABASE_URL } = process.env

export const supabase = new SupabaseClient(
  VITE_SUPABASE_URL as string,
  SUPABASE_SERVICE_KEY as string,
)

export const getPatchesToCheck = async (): Promise<Patch[] | null> => {
  Logger.debug("Getting unreleased patches...")
  const response = await supabase.from<Patch>("patches").select().is("releasedAt", null)

  if (response.error != null) {
    Logger.error(response.error)
    return null
  }

  Logger.debug(response.data.map((p) => p.id))

  return response.data
}

export const updatePatchData = async (patch: Patch, data: PatchData) => {
  Logger.info(`Updating ${patch.id}...`)

  const links = [...patch.links]

  links.push(`https://dota2.com/patches/${patch.id}`)

  if (data.patch_website != null) {
    links.push(`https://dota2.com/${data.patch_website}`)
  }

  const newData: Partial<Patch> = {
    releasedAt: new Date(data.patch_timestamp * 1000).toISOString(),
    links: Array.from(new Set(links)),
  }

  Logger.debug(newData)

  const response = await supabase
    .from<Patch>("patches")
    .update(newData)
    .eq("id", patch.id)

  if (response.error != null) {
    Logger.error(response.error)
  }
}

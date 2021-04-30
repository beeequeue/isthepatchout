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
  let links = [`https://dota2.com/patches/${data.patch_number}`]

  if (data.patch_website != null) {
    links = [`https://dota2.com/${data.patch_website}`, ...links]
  }

  return {
    id: data.patch_number,
    number: new DotaVersion(data.patch_number).toNumber(),
    releasedAt: new Date(data.patch_timestamp * 1000).toISOString(),
    links,
  }
}

export const removeUnreleasedPatches = async () => {
  Logger.info("Deleting unreleased patches...")

  const { error } = await supabase.from<Patch>("patches").delete().is("releasedAt", null)

  if (error) {
    Logger.error(error)
    throw new Error(error.message)
  }
}

export const insertUpcomingPatches = async () => {
  Logger.info("Deleting unreleased patches...")

  const { data: lastReleasedPatch, error } = await supabase
    .from<Patch>("patches")
    .select("id")
    .not("releasedAt", "is", null)
    .order("number", { ascending: false })

  Logger.debug(lastReleasedPatch![0])

  if (error) {
    Logger.error(error)
    throw new Error(error.message)
  }

  const lastVersion = new DotaVersion(lastReleasedPatch![0].id)

  const upcomingVersions = [
    lastVersion.increment("minor"),
    lastVersion.increment("patch"),
  ]

  Logger.debug(upcomingVersions)

  await supabase.from<Patch>("patches").insert(
    upcomingVersions.map((version) => ({
      id: version.toString(),
      number: version.toNumber(),
      links: [],
    })),
  )
}

export const upsertPatches = async (patches: Patch[]) => {
  Logger.info(`Inserting or updating ${patches.length} patches...`)

  const { error } = await supabase.from<Patch>("patches").upsert(patches)

  if (error) {
    Logger.error(error)
    throw new Error(error.message)
  }
}

import { DotaVersion } from "dotaver"

import type { Patch } from "~~/lib/types"

import type { PatchNoteListItem } from "./dota"

export const okResponse = { ok: true }

export const formatPatchData = (data: PatchNoteListItem): Patch => {
  let links = [`https://dota2.com/patches/${data.patch_number}`]

  if (data.patch_website != null) {
    links = [`https://dota2.com/${data.patch_website}`, ...links]
  }

  return {
    id: data.patch_number,
    number: DotaVersion.parse(data.patch_number).toNumber(),
    releasedAt: new Date(data.patch_timestamp * 1000).toISOString(),
    links,
  }
}

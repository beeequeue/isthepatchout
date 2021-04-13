import { SupabaseClient } from "@supabase/supabase-js"

import type { Patch } from "../src/types"

import type { PatchData } from "./_dota"

const { SUPABASE_SERVICE_KEY, VITE_SUPABASE_URL } = process.env

export const supabase = new SupabaseClient(
  VITE_SUPABASE_URL as string,
  SUPABASE_SERVICE_KEY as string,
)

export const getPatchesToCheck = async (): Promise<Patch[] | null> => {
  const response = await supabase.from<Patch>("patches").select().eq("released", false)

  if (response.error != null) {
    console.error(response.error)
    return null
  }

  return response.data
}

export const updatePatchData = async (patch: Patch, data: PatchData) => {
  const links = JSON.parse(patch.links) as string[]

  links.push(`https://dota2.com/patches/${patch.id}`)

  if (data.patch_website != null) {
    links.push(`https://dota2.com/${data.patch_website}`)
  }

  const response = await supabase
    .from<Patch>("patches")
    .update({
      released: true,
      links: JSON.stringify(Array.from(new Set(links))),
    })
    .eq("id", patch.id)

  if (response.error != null) {
    console.error(response.error)
  }
}

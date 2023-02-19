import { DotaVersion } from "dotaver"

import { SupabaseClient } from "@supabase/supabase-js"

import type { Database, Patch } from "@/lib/types"

import type { PatchNoteListItem } from "./_dota"
import { Logger } from "./_logger"
import { UpdateSubscriptionInput } from "./subscription"

const { SUPABASE_SERVICE_KEY, VERCEL_ENV, VITE_SUPABASE_URL } = process.env as Record<
  string,
  string
>

export const supabase = new SupabaseClient<Database>(
  VITE_SUPABASE_URL,
  SUPABASE_SERVICE_KEY,
)

// -------------------------------------
// -------------- PATCHES --------------
// -------------------------------------

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

export const upsertPatches = async (patches: Patch[]) => {
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

// -------------------------------------------
// -------------- SUBSCRIPTIONS --------------
// -------------------------------------------

export const doesSubscriptionExist = async (endpoint: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("endpoint")
    .eq("endpoint", endpoint)
    .limit(1)
    .maybeSingle()

  if (error) {
    throw new Error(error.message)
  }

  return data != null
}

export const upsertSubscription = async ({
  endpoint,
  keys: { auth, p256dh },
}: UpdateSubscriptionInput) => {
  const { error } = await supabase.from("subscriptions").upsert(
    {
      type: "push",
      endpoint,
      auth,
      extra: p256dh,
      environment: VERCEL_ENV,
      lastNotified: 0,
    },
    { onConflict: "endpoint" },
  )

  if (error) {
    throw new Error(error.message)
  }
}

export const deleteSubscription = async (endpoint: string) => {
  const { error } = await supabase.from("subscriptions").delete().eq("endpoint", endpoint)

  if (error) {
    throw new Error(error.message)
  }
}

// ----------------------------------------------
// -------------- DISCORD WEBHOOKS --------------
// ----------------------------------------------

export const registerDiscordWebhook = async (
  endpoint: string,
  guildId: string,
  id: string,
) => {
  const { error } = await supabase.from("subscriptions").upsert(
    {
      type: "discord",
      endpoint,
      auth: guildId,
      extra: id,
      environment: VERCEL_ENV,
      lastNotified: 0,
    },
    { onConflict: "endpoint" },
  )

  if (error) {
    throw new Error(error.message)
  }
}

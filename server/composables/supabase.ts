import { serverSupabaseServiceRole } from "#supabase/server"
import { H3Event } from "h3"
import { Database, Patch } from "~/lib/types"
import type { UpdateSubscriptionInput } from "~/server/api/subscription.post"
import { Logger } from "~/server/utils/logger"

export const serverSupabase = (event: H3Event) => {
  const config = useRuntimeConfig()
  const supabase = serverSupabaseServiceRole<Database>(event)

  // -------------------------------------
  // -------------- PATCHES --------------
  // -------------------------------------

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

  // -------------------------------------------
  // -------------- SUBSCRIPTIONS --------------
  // -------------------------------------------

  const doesSubscriptionExist = async (endpoint: string): Promise<boolean> => {
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

  const upsertSubscription = async ({
    endpoint,
    keys: { auth, p256dh },
  }: UpdateSubscriptionInput) => {
    const { error } = await supabase.from("subscriptions").upsert(
      {
        type: "push",
        endpoint,
        auth,
        extra: p256dh,
        environment: config.public.env,
        lastNotified: 0,
      },
      { onConflict: "endpoint" },
    )

    if (error) {
      throw new Error(error.message)
    }
  }

  const deleteSubscription = async (endpoint: string) => {
    const { error } = await supabase
      .from("subscriptions")
      .delete()
      .eq("endpoint", endpoint)

    if (error) {
      throw new Error(error.message)
    }
  }

  // ----------------------------------------------
  // -------------- DISCORD WEBHOOKS --------------
  // ----------------------------------------------

  const registerDiscordWebhook = async (
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
        environment: config.public.env,
        lastNotified: 0,
      },
      { onConflict: "endpoint" },
    )

    if (error) {
      throw new Error(error.message)
    }
  }

  return {
    upsertPatches,
    doesSubscriptionExist,
    upsertSubscription,
    deleteSubscription,
    registerDiscordWebhook,
  }
}

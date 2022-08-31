import type { RealtimeChannel } from "@supabase/realtime-js"
import { SupabaseClient } from "@supabase/supabase-js"

import { mutations } from "./state"
import type { Database, Patch, RealtimeChange } from "./types"

export const supabase = new SupabaseClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLIC_KEY,
)

export const fetchLatestPatch = async () => {
  const result = await supabase
    .from("patches")
    .select()
    .not("releasedAt", "is", null)
    .order("number", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (result.data != null) {
    mutations.updateInitialData(result.data)
  }
}

const filter = (event: "INSERT" | "UPDATE") => ({
  event,
  schema: "public",
  table: "patches",
})

export const initChangeDetection = (latestPatch: Patch): RealtimeChannel => {
  const handler = (payload: RealtimeChange<"patches">) => {
    if (
      payload.record?.releasedAt != null &&
      payload.record.number >= (latestPatch.number ?? 0)
    ) {
      mutations.releaseNewPatch(payload.record)
    }
  }

  const channel = supabase.channel("public:patches")

  channel
    .on("postgres_changes", filter("UPDATE"), handler)
    .on("postgres_changes", filter("INSERT"), handler)
    .subscribe()

  return channel
}

export const removeChannel = (channel: RealtimeChannel) => supabase.removeChannel(channel)

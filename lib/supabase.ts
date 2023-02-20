import type {
  RealtimeChannel,
  RealtimePostgresInsertPayload,
} from "@supabase/realtime-js"
import { SupabaseClient } from "@supabase/supabase-js"

import { mutations } from "./state"
import type { Database, Patch } from "./types"

const table = "patches" as const

const config = useRuntimeConfig()

export const supabase = new SupabaseClient<Database>(
  config.public.subabaseUrl,
  config.public.subabasPublicKey,
)

export const fetchLatestPatch = async () => {
  const result = await supabase
    .from(table)
    .select()
    .not("releasedAt", "is", null)
    .order("number", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (result.data != null) {
    mutations.updateInitialData(result.data)
  }
}

export const initChangeDetection = (latestPatch: Patch): RealtimeChannel => {
  const handler = (payload: RealtimePostgresInsertPayload<Patch>) => {
    if (payload.new.releasedAt != null && payload.new.number >= latestPatch.number) {
      mutations.releaseNewPatch(payload.new)
    }
  }

  const channel = supabase.channel(`public:${table}`)

  channel
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table,
      },
      handler,
    )
    .subscribe()

  return channel
}

export const removeChannel = (channel: RealtimeChannel) => supabase.removeChannel(channel)

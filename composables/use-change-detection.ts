import type {
  RealtimeChannel,
  RealtimePostgresInsertPayload,
} from "@supabase/realtime-js"

import { mutations } from "~/lib/state"

import { Database, Patch } from "@/lib/types"

const table = "patches" as const

export const useChangeDetection = () => {
  const supabase = useSupabaseClient<Database>()
  const channel = ref<RealtimeChannel>(supabase.channel(`public:${table}`))

  const initChangeDetection = (patch: Patch) => {
    const handler = (payload: RealtimePostgresInsertPayload<Patch>) => {
      if (payload.new.releasedAt != null && payload.new.number >= patch.number) {
        mutations.releaseNewPatch(payload.new)
      }
    }

    channel.value
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
  }

  onBeforeUnmount(async () => {
    await supabase.removeChannel(channel.value as RealtimeChannel)
  })

  return { channel, initChangeDetection } as const
}

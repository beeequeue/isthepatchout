import type {
  RealtimeChannel,
  RealtimePostgresInsertPayload,
} from "@supabase/realtime-js"

import type { Database, Patch } from "@/lib/types"

const table = "patches"

export const useChangeDetection = () => {
  const supabase = useSupabaseClient<Database>()
  const channel = ref<RealtimeChannel>(supabase.channel(`public:${table}`))

  const { patch, updatePatch } = usePatch()

  const initChangeDetection = () => {
    const handler = (payload: RealtimePostgresInsertPayload<Patch>) => {
      if (payload.new.releasedAt != null && payload.new.number >= patch.value!.number) {
        updatePatch(payload.new)
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

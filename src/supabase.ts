import { SupabaseClient, SupabaseRealtimePayload } from "@supabase/supabase-js"

import { mutations } from "./state"
import { Patch } from "./types"

export const supabase = new SupabaseClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_PUBLIC_KEY as string,
)

export const fetchLatestPatch = async () => {
  const result = await supabase
    .from<Patch>("patches")
    .select()
    .not("releasedAt", "is", null)
    .order("number", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (result.data != null) {
    mutations.updateInitialData(result.data)
  }
}

export const initChangeDetection = (latestPatch: Patch) => {
  const handler = (payload: SupabaseRealtimePayload<Patch>) => {
    if (
      payload.new.releasedAt != null &&
      payload.new.number >= (latestPatch.number ?? 0)
    ) {
      mutations.releaseNewPatch(payload.new)
    }
  }

  const subscription = supabase
    .from<Patch>("patches")
    .on("UPDATE", handler)
    .on("INSERT", handler)
    .subscribe()

  return () => {
    subscription.unsubscribe()
  }
}

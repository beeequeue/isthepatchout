import { SupabaseClient } from "@supabase/supabase-js"

import { mutations } from "./state"
import type { Database, Patch } from "./types"

export const supabase = new SupabaseClient<Database>(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_PUBLIC_KEY as string,
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

const filter = (event: "UPDATE" | "INSERT") => ({
  event,
  schema: "public",
  table: "patches",
})

export const initChangeDetection = (latestPatch: Patch) => {
  const handler = (payload: unknown) => {
    if (
      payload.new.releasedAt != null &&
      payload.new.number >= (latestPatch.number ?? 0)
    ) {
      mutations.releaseNewPatch(payload.new)
    }
  }

  supabase
    .channel("db-changes")
    .on("postgres_changes", filter("UPDATE"), handler)
    .on("postgres_changes", filter("INSERT"), handler)
    .subscribe()
}

import { onUnmounted, ref } from "vue"

import { SupabaseClient, SupabaseRealtimePayload } from "@supabase/supabase-js"

import { Patch } from "./types"

export const supabase = new SupabaseClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_PUBLIC_KEY as string,
)

type PostgrestError = {
  message: string
  details: string
  hint: string
  code: string
}

export const useQuery = (table: string, patch: string) => {
  const data = ref<Record<string, unknown> | null>(null)
  const error = ref<PostgrestError | null>(null)
  const loading = ref(true)

  void supabase
    .from<Patch>(table)
    .select()
    .eq("id", patch)
    .single()
    .then((result) => {
      if (result.error != null) {
        error.value = result.error
        data.value = null
      } else {
        error.value = null
        data.value = result.data
      }

      loading.value = false
    })

  const handler = (payload: SupabaseRealtimePayload<Record<string, unknown>>) => {
    data.value = payload.new
  }

  const subscription = supabase
    .from<Patch>(`${table}:id=eq.${patch}`)
    .on("UPDATE", handler)
    .on("INSERT", handler)
    .subscribe()

  onUnmounted(() => {
    subscription.unsubscribe()
  })

  return {
    data,
    error,
    loading,
  }
}

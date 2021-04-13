import { onUnmounted, ref } from "vue"

import { SupabaseClient, SupabaseRealtimePayload } from "@supabase/supabase-js"

import { definitions } from "./generated"

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

export const useQuery = <
  Table extends keyof definitions,
  Data extends definitions[Table]
>(
  table: Table,
  id: string,
) => {
  const data = ref<Data | null>(null)
  const error = ref<PostgrestError | null>(null)
  const loading = ref(true)

  void supabase
    .from<Data>(table)
    .select()
    .eq("id", id as any)
    .then((result) => {
      if (result.error != null) {
        error.value = result.error
        data.value = null
      } else {
        error.value = null
        // eslint-disable-next-line prefer-destructuring
        data.value = result.data[0] as any
      }

      loading.value = false
    })

  const handler = (payload: SupabaseRealtimePayload<Data>) => {
    data.value = payload.new as any
  }

  const subscription = supabase
    .from<Data>(`${table}:id=eq.${id}`)
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

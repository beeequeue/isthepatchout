import { isAfter } from "date-fns"
import { computed, onUnmounted, ref } from "vue"

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

export const usePatches = () => {
  const data = ref<Patch[]>([])
  const error = ref<PostgrestError | null>(null)
  const loading = ref(true)

  void supabase
    .from<Patch>("patches")
    .select()
    .limit(3)
    .order("number", { ascending: false })
    .then((result) => {
      if (result.error != null) {
        console.error(result.error)
        error.value = result.error
        data.value = []
      } else {
        error.value = null
        // Reverse the order for easier usage in stuff like reduce
        data.value = result.data.reverse()
      }

      loading.value = false
    })

  const handler = (payload: SupabaseRealtimePayload<Patch>) => {
    const relevantPatchIndex = data.value.findIndex(
      (patch) => patch.id === payload.new.id,
    )

    if (relevantPatchIndex === -1) return

    data.value[relevantPatchIndex] = payload.new
  }

  const subscription = supabase
    .from<Patch>("patches")
    .on("UPDATE", handler)
    .on("INSERT", handler)
    .subscribe()

  onUnmounted(() => {
    subscription.unsubscribe()
  })

  const last = computed(() =>
    data.value.reduce(
      (accum, patch) =>
        accum == null ||
        (patch.releasedAt != null &&
          isAfter(new Date(patch.releasedAt), new Date(accum.releasedAt!)))
          ? patch
          : accum,
      null as Patch | null,
    ),
  )

  const upNext = computed(() => data.value.filter((patch) => patch.releasedAt == null))

  return {
    last,
    upNext,
    error,
    loading,
  }
}

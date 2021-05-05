import { computed, onUnmounted, ref } from "vue"

import { captureException } from "@sentry/vue"
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

export const useUnreleasedPatches = () => {
  const data = ref<Patch[]>([])
  const error = ref<PostgrestError | null>(null)
  const loading = ref(true)

  void supabase
    .from<Patch>("patches")
    .select()
    .is("releasedAt", null)
    .limit(2)
    .order("number", { ascending: false })
    .then((result) => {
      if (result.error != null) {
        captureException(result.error)

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

  const upNext = computed(() => data.value.filter((patch) => patch.releasedAt == null))

  return {
    upNext,
    error,
    loading,
  }
}

export const useLastReleasedPatch = () => {
  const data = ref<Patch | null>(null)
  const error = ref<PostgrestError | null>(null)
  const loading = ref(true)

  void supabase
    .from<Patch>("patches")
    .select()
    .not("releasedAt", "is", null)
    .order("number", { ascending: false })
    .limit(1)
    .single()
    .then((result) => {
      if (result.error != null) {
        captureException(result.error)

        error.value = result.error
        data.value = null
      } else {
        error.value = null
        data.value = result.data
      }

      loading.value = false
    })

  const handler = (payload: SupabaseRealtimePayload<Patch>) => {
    if (
      payload.new.releasedAt != null &&
      payload.new.number >= (data.value?.number ?? 0)
    ) {
      data.value = payload.new
    }
  }

  const subscription = supabase
    .from<Patch>("patches")
    .on("UPDATE", handler)
    .on("INSERT", handler)
    .subscribe()

  onUnmounted(() => {
    subscription.unsubscribe()
  })

  return {
    last: data,
    error,
    loading,
  }
}

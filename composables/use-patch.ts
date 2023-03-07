import { Database, Patch } from "~/lib/types"

const patch = ref<Patch | null>(null)

const releasedBeforeOpening = ref(false)
const recentlyReleased = computed(() => isRecentlyReleased(patch.value))

export const usePatch = () => {
  const supabase = useSupabaseClient<Database>()

  const fetchPatch = async () => {
    const result = await useAsyncData("patch", async () =>
      supabase
        .from("patches")
        .select()
        .order("number", { ascending: false })
        .limit(1)
        .maybeSingle(),
    )

    if (result.error.value == null && result.data.value?.error == null) {
      patch.value = result.data.value!.data

      if (isRecentlyReleased(patch.value)) {
        releasedBeforeOpening.value = true
      }
    }

    return result
  }

  const updatePatch = (newPatch: Patch) => {
    patch.value = newPatch
    releasedBeforeOpening.value = false
  }

  return {
    patch,
    recentlyReleased,
    releasedBeforeOpening,

    fetchPatch,
    updatePatch,
  }
}

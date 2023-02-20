<template>
  <main class="grid justify-items-center items-center h-1/1">
    <background-image />

    <content :patch="patch" :recently-released="recentlyReleased" />

    <bottom-bar />
  </main>
</template>

<script lang="ts" setup>
import { Database } from "@/lib/types"

const { initChangeDetection } = useChangeDetection()
const supabase = useSupabaseClient<Database>()

const { data } = await useAsyncData("patch", async () =>
  supabase
    .from("patches")
    .select()
    .order("number", { ascending: false })
    .limit(1)
    .maybeSingle(),
)

if (data.value != null && data.value.data != null) {
  initChangeDetection(data.value.data)
}

const patch = computed(() => data.value?.data ?? null)
const recentlyReleased = computed(() => isRecentlyReleased(data.value?.data))
</script>

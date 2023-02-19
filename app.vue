<template>
  <main class="grid justify-items-center items-center h-1/1">
    <FadeTransition>
      <LoadingState v-if="state.loading" key="loading" />

      <Content v-else key="main" />
    </FadeTransition>

    <BottomBar />
  </main>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue"

import type { RealtimeChannel } from "@supabase/realtime-js"

import { state } from "@/lib/state"
import { fetchLatestPatch, initChangeDetection, removeChannel } from "@/lib/supabase"

void fetchLatestPatch()
const channel = ref<RealtimeChannel | null>(null)

watch(
  () => state.latestPatch,
  (newPatch, _, onCleanup) => {
    if (newPatch != null) {
      channel.value = initChangeDetection(newPatch)

      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onCleanup(() => {
        void removeChannel(channel.value as RealtimeChannel)
      })
    } else if (channel.value != null) {
      void removeChannel(channel.value as RealtimeChannel)
    }
  },
  { deep: true },
)

document.querySelector("#background")?.classList.add("!opacity-100")
</script>

<style scoped>
main {
  grid-template-rows: 1fr auto;
}
</style>

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
import { watch } from "vue"

import BottomBar from "./components/bottom-bar/bottom-bar.vue"
import Content from "./components/content.vue"
import FadeTransition from "./components/fade-transition.vue"
import LoadingState from "./components/loading-state.vue"
import { state } from "./state"
import { fetchLatestPatch, initChangeDetection } from "./supabase"

void fetchLatestPatch()

watch(
  () => state.latestPatch,
  (newPatch, _, onCleanup) => {
    if (newPatch != null) {
      const unsubscribe = initChangeDetection(newPatch)

      onCleanup(unsubscribe)
    }
  },
  { deep: true },
)
</script>

<style scoped>
main {
  grid-template-rows: 1fr auto;
}
</style>

<template>
  <main class="grid justify-items-center items-center h-1/1">
    <FadeTransition>
      <LoadingState v-if="loading" key="loading" />

      <Content
        v-else
        key="main"
        :last="last"
        :relevant-patches="relevantPatches"
        :recently-released="recentlyReleased"
        :initial-released-value="initialReleasedValue"
      />
    </FadeTransition>

    <BottomBar />
  </main>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue"

import BottomBar from "./components/bottom-bar/bottom-bar.vue"
import Content from "./components/content.vue"
import FadeTransition from "./components/fade-transition.vue"
import LoadingState from "./components/loading-state.vue"
import { useLastReleasedPatch, useUnreleasedPatches } from "./supabase"

const { last, recentlyReleased, loading: loadingLastPatch } = useLastReleasedPatch()
const { upNext, loading: loadingUpcoming } = useUnreleasedPatches()

const loading = computed(() => loadingLastPatch.value || loadingUpcoming.value)

const relevantPatches = computed(
  () => (recentlyReleased.value ? [last.value!] : upNext.value) ?? [],
)

const initialReleasedValue = ref<boolean | null>(null)

watch(loadingLastPatch, (newLoading, oldLoading) => {
  if (oldLoading && !newLoading) {
    initialReleasedValue.value = recentlyReleased.value
  }
})

watch(recentlyReleased, (newValue) => {
  if (newValue) {
    document.title = `${last.value!.id} is out!`
  }
})
</script>

<style scoped>
main {
  grid-template-rows: 1fr auto;
}
</style>

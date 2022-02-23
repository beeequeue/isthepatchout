<template>
  <main class="grid justify-items-center items-center h-1/1">
    <Fade>
      <Loading v-if="loading" key="loading" />

      <Main
        v-else
        key="main"
        :last="last ?? undefined"
        :relevant-patches="relevantPatches"
        :recently-released="recentlyReleased"
        :released-while-open="releasedWhileOpen"
      />
    </Fade>

    <BottomBar />
  </main>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from "vue"

import BottomBar from "./components/bottom-bar/bottom-bar.vue"
import Fade from "./components/fade.vue"
import Loading from "./components/loading.vue"
import Main from "./components/main.vue"
import { useLastReleasedPatch, useUnreleasedPatches } from "./supabase"

const { last, recentlyReleased, loading: lastPatchLoading } = useLastReleasedPatch()
const { upNext, loading: upcomingLoading } = useUnreleasedPatches()

const loading = computed(() => lastPatchLoading.value || upcomingLoading.value)

const relevantPatches = computed(
  () => (recentlyReleased.value ? [last.value!] : upNext.value) ?? [],
)

const releasedWhileOpen = ref(false)

watch(recentlyReleased, (newValue, oldValue) => {
  if (!oldValue && newValue) {
    releasedWhileOpen.value = true
  }

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

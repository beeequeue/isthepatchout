<template>
  <main
    class="
      container
      mx-auto
      flex flex-col
      justify-center
      items-center
      h-screen
      px-4
      pt-15
      md:py-20 md:px-10 md:justify-center
      text-gray-300
      select-none
    "
  >
    <Fade>
      <Loading v-if="loading" key="loading" />

      <Main
        v-else
        key="main"
        :last="last ?? undefined"
        :relevant-patches="relevantPatches"
        :recently-released="recentlyReleased"
      />
    </Fade>

    <BottomBar />
  </main>
</template>

<script lang="ts" setup>
import { computed, watch } from "vue"

import BottomBar from "./components/bottom-bar.vue"
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

watch(recentlyReleased, (isRecentlyReleased) => {
  if (isRecentlyReleased) {
    document.title = `${last.value!.id} is out!`
  }
})
</script>

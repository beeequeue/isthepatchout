<template>
  <question :relevant-patches="relevantPatches" />

  <fade class="h-50">
    <loading v-if="loading" />
    <answer v-else :released="recentlyReleased" />
  </fade>

  <ul v-if="recentlyReleased" class="links">
    <li v-for="link in links" :key="link">
      <a :href="link" target="_blank" rel="noopener">{{ link }}</a>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { computed, watch } from "vue"

import { useLastReleasedPatch, useUnreleasedPatches } from "../supabase"

import Answer from "./answer.vue"
import Fade from "./fade.vue"
import Loading from "./loading.vue"
import Question from "./question.vue"

const { last, recentlyReleased, loading: lastPatchLoading } = useLastReleasedPatch()
const { upNext, loading: upcomingLoading } = useUnreleasedPatches()

const loading = computed(() => lastPatchLoading.value || upcomingLoading.value)

const relevantPatches = computed(
  () => (recentlyReleased.value ? [last.value!] : upNext.value) ?? [],
)

const links = computed(() => (last.value?.links != null ? last.value.links : null))

watch(recentlyReleased, (isRecentlyReleased) => {
  if (isRecentlyReleased) {
    document.title = `${last.value!.id} is out!`
    // new Notification(`PATCH ${last.value!.id} IS OUT!`)
  }
})
</script>

<style scoped>
.answer {
  font-size: 10em;
  font-weight: 800;
  line-height: 100%;
}

.links {
  font-size: 1.25em;
}
</style>

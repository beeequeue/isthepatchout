<template>
  <section class="main">
    <div class="question">
      Is
      <div v-for="(patch, i) in relevantPatches" :key="patch?.id" class="patch">
        <span class="patch-number">{{ patch?.id }}</span>
        <span v-if="i + 1 !== relevantPatches.length">{{ " " }}or{{ " " }}</span>
      </div>
      out yet?
    </div>

    <div v-if="loading">Loading...</div>
    <div v-else-if="error">
      {{ error }}
    </div>
    <div v-else class="answer">
      {{ recentlyReleased ? "Yes!" : "No." }}
    </div>

    <ul v-if="recentlyReleased" class="links">
      <li v-for="link in links" :key="link">
        <a :href="link" target="_blank" rel="noopener">{{ link }}</a>
      </li>
    </ul>
  </section>
</template>

<script lang="ts" setup>
import { differenceInDays } from "date-fns"
import { computed, watch } from "vue"

import { useLastReleasedPatch, useUnreleasedPatches } from "../supabase"

const { last, loading: lastPatchLoading } = useLastReleasedPatch()
const { upNext, error, loading: upcomingLoading } = useUnreleasedPatches()

const loading = computed(() => lastPatchLoading.value || upcomingLoading.value)

const recentlyReleased = computed(
  () =>
    last.value != null &&
    differenceInDays(Date.now(), new Date(last.value.releasedAt!)) < 7,
)

const relevantPatches = computed(
  () => (recentlyReleased.value ? [last.value] : upNext.value) ?? [],
)

const links = computed(() =>
  last.value?.links != null ? ((last.value.links as unknown) as string[]) : null,
)

watch(recentlyReleased, (isRecentlyReleased) => {
  if (isRecentlyReleased) {
    document.title = `${last.value!.id} is out!`
    new Notification(`PATCH ${last.value!.id} IS OUT!`)
  }
})
</script>

<style scoped>
.patch-number {
  font-size: 2.5em;
  min-width: 200px;
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.25);
  font-weight: 700;
}

.question {
  display: flex;
  flex-direction: column;

  font-size: 1.75em;
  color: #ccc;
}

.question .patch {
  display: flex;
  flex-direction: column;
}

.answer {
  font-size: 10em;
  font-weight: 800;
  line-height: 100%;
}

.links {
  font-size: 1.25em;
}
</style>

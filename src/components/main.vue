<template>
  <section class="main">
    <div class="question">
      Is
      <br />
      <span class="big">{{ patch }}</span>
      <br />
      out yet?
    </div>

    <div v-if="loading">Loading...</div>
    <div v-else-if="error">
      {{ error }}
    </div>
    <div v-else class="answer">
      {{ released ? "Yes!" : "No." }}
    </div>

    <ul v-if="released" class="links">
      <li v-for="link in links" :key="link">
        <a :href="link" target="_blank" rel="noopener">{{ link }}</a>
      </li>
    </ul>
  </section>
</template>

<script lang="ts" setup name="Main">
import { computed, defineProps, watch } from "vue"

import { useQuery } from "../supabase"

const props = defineProps<{ patch: string }>()

const { data, error, loading } = useQuery("patches", props.patch)

const released = computed(() => data.value?.releasedAt != null)
const links = computed(() =>
  data.value?.links != null ? ((data.value.links as unknown) as string[]) : null,
)

watch(data, (value, previous) => {
  if (previous?.releasedAt == null && value?.releasedAt != null) {
    document.title = `${props.patch} is out!`

    new Notification(`PATCH ${props.patch} IS OUT!`)
  }
})
</script>

<style scoped>
.big {
  font-size: 2em;
}

.question {
  font-size: 2em;
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

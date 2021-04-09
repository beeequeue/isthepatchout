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
      {{ data?.released === true ? "Yes!" : "No." }}
    </div>
  </section>
</template>

<script lang="ts" setup name="Main">
import { defineProps, watch } from "vue"

import { useQuery } from "../supabase"

const props = defineProps<{ patch: string }>()

const { data, error, loading } = useQuery("patches", props.patch)

watch(data, (value, previous) => {
  if (previous?.released !== true && value?.released === true) {
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
</style>

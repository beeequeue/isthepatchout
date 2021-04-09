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
      {{ data.released === true ? "Yes!" : "No." }}
    </div>
  </section>
</template>

<script lang="ts" setup name="Main">
import { defineProps } from "vue"

import { useQuery } from "../supabase"

const props = defineProps<{ patch: string }>()

const { data, error, loading } = useQuery("patches", props.patch)
</script>

<style>
html,
body,
#app {
  height: 100%;
  width: 100%;
}

body {
  background: #111;
  color: #eee;
  text-shadow: 0 0 2px rgba(255, 255, 255, 0.15);
}

#app {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  text-align: center;
}

.big {
  font-size: 2em;
}

.main {
  margin-bottom: 1em;
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

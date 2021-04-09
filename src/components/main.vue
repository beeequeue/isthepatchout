<template>
  <section class="main">
    <div class="question">
      Is
      <br />
      <span class="big">{{ data.id }}</span>
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

  <section class="disclaimer">
    <i>The page will automatically update when the patch is released!</i>
  </section>

  <button @click="test">test</button>
</template>

<script lang="ts" setup name="Main">
import { supabase, useQuery } from "../supabase"

const { data, error, loading } = useQuery("patches", "7.29")

const test = async () => {
  const result = await supabase
    .from("patches")
    .update({
      released: true,
    })
    .eq("id", "7.29")

  console.log(result)
}
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

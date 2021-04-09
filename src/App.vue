<template>
  <Main :patch="patch" />

  <section class="disclaimer">
    <i>The page will automatically update when the patch is released!</i>
  </section>
</template>

<script lang="ts" setup>
import Main from "./components/main.vue"
import { supabase } from "./supabase"

const patch = "7.29"
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

<template>
  <Main :patch="patch" />

  <section class="disclaimer">
    <i>The page will automatically update when the patch is released!</i>
  </section>

  <notifications />
</template>

<script lang="ts" setup>
import Main from "./components/main.vue"
import Notifications from "./components/notifications.vue"

const patch = "7.29"

document.title = `Is ${patch} out yet?`
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
  gap: 1.5em;

  text-align: center;
}
</style>

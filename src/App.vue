<template>
  <Main />

  <section class="disclaimer">
    <i>The page will automatically update when the patch is released!</i>
  </section>

  <Notifications />
</template>

<script lang="ts" setup>
import Main from "./components/main.vue"
import Notifications from "./components/notifications.vue"
</script>

<style>
:root {
  --bg-100: #080808;
  --bg-150: #0f0f0f;
  --bg-200: #141414;
  --bg-300: #181818;
  --bg-400: #202020;
  --bg-500: #202020;

  --bg-base: linear-gradient(145deg, var(--bg-150), var(--bg-100));
  --bg-clickable: linear-gradient(145deg, var(--bg-500), var(--bg-400));

  --text-400: #f0e6e6;

  --shadow-br-small: 4px 4px 14px #000;
  --shadow-tl-small: -4px -4px 14px #222;

  --shadows: var(--shadow-br-small), var(--shadow-tl-small);
  --shadows-inset: 8px 8px 16px #070707, -4px -4px 14px #161616, inset 4px 4px 5px #070707,
    inset -4px -4px 5px #161616;
}

html,
body,
#app {
  height: 100%;
  width: 100%;
}

body {
  background: var(--bg-base);
  color: var(--text-400);
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

a {
  color: cornflowerblue;
}
</style>

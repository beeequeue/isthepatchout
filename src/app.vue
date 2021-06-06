<template>
  <main>
    <Main />
  </main>

  <section class="disclaimer">
    <i>The page will automatically update when the patch is released!</i>
  </section>

  <Notifications />
</template>

<script lang="ts" setup>
import Main from "./components/main.vue"
import Notifications from "./components/notifications.vue"
</script>

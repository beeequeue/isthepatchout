<template>
  <main
    class="
      container
      mx-auto
      h-screen
      px-4
      py-10
      md:px-10
      flex flex-col
      items-center
      md:justify-center
      text-center text-gray-300
    "
  >
    <Main />

    <section class="disclaimer">
      <i>The page will automatically update when the patch is released!</i>
    </section>

    <Notifications />
  </main>
</template>

<script lang="ts" setup>
import Main from "./components/main.vue"
import Notifications from "./components/notifications.vue"
</script>

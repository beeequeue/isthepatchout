<template>
  <nav
    class="
      relative
      grid
      auto-cols-max
      justify-center
      items-center
      w-1/1
      md:w-auto
      mt-auto
      md:mb-5
      p-1
      shadow-lg
      md:rounded-lg
      bg-gradient-to-br
      from-gray-900/75
      to-gray-900/20
    "
  >
    <Notifications />

    <GitHubLink />
  </nav>
</template>

<script lang="ts" setup>
import { defineProps } from "vue"

import GitHubLink from "./github-link.vue"
import Notifications from "./notifications.vue"

defineProps()
</script>

<style scoped>
nav > * {
  grid-row: 1;
}
</style>

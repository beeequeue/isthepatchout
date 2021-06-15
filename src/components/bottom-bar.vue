<template>
  <nav
    class="
      relative
      grid
      auto-cols-min
      w-1/1
      md:w-auto
      mt-auto
      md:mb-5
      p-1
      shadow-lg
      md:rounded-lg
      bg-gradient-to-br
      from-gray-900/75
    "
  >
    <Notifications />
  </nav>
</template>

<script lang="ts" setup>
import { defineProps } from "vue"

import Notifications from "./notifications.vue"

defineProps()
</script>

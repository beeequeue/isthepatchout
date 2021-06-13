<template>
  <nav
    class="
      flex
      relative
      justify-center
      align-center
      <md:w-1/1
      mt-auto
      md:mb-5
      py-2
      px-4
      md:rounded-lg
      bg-gradient-to-br
      from-gray-900
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

<template>
  <nav class="flex relative justify-center align-center w-1/1 mt-auto py-2 px-4">
    <Notifications />
  </nav>
</template>

<script lang="ts" setup>
import { defineProps } from "vue"

import Notifications from "./notifications.vue"

defineProps()
</script>

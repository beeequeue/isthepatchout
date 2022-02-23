<template>
  <div
    v-if="!hidden"
    class="absolute top-2 left-35 p-2 flex items-center rounded-lg shadow-lg bg-gray-900"
  >
    <Icon :icon="arrowSvg" class="h-10 w-10 flex-shrink-0" />

    <div class="max-w-90 p-y2 text-center">
      If you want a sound to play when a patch is released you'll have to allow
      autoplaying audio
    </div>

    <Clickable @click="hidden = true">Close</Clickable>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"

import arrowSvg from "../assets/arrow-up.svg?raw"

import Icon from "./bottom-bar/icon.vue"
import Clickable from "./clickable.vue"

const hidden = ref(false)
</script>

<style scoped>
@keyframes clicked {
  0% {
    border-color: transparent;
  }
  50% {
    border-color: #444;
  }
  100% {
    border-color: transparent;
  }
}

.clickable {
  outline: 0;
}

.clicked {
  animation: clicked 350ms forwards;
}
</style>

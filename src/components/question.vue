<template>
  <div
    class="
      flex flex-col
      md:flex-row md:items-center md:gap-2
      text-2xl
      md:text-4xl
      font-serif
      h-18
      transition-opacity transition-faster
      delay-500
    "
    :class="{ 'opacity-0': relevantPatches.length < 1 }"
  >
    Is

    <div
      v-for="(patch, i) in relevantPatches"
      :key="patch?.id"
      class="md:flex md:items-center md:gap-2"
    >
      <span v-if="i !== 0">{{ " " }}or{{ " " }}</span>

      <span class="font-bold text-5xl md:text-7xl text-primary-500">{{ patch?.id }}</span>
    </div>

    out yet?
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from "vue"

import type { Patch } from "../types"

const props = defineProps<{ relevantPatches: Patch[] }>()
</script>

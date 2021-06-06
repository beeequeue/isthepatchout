<template>
  <div class="flex flex-col md:flex-row text-2xl font-serif">
    Is

    <div v-for="(patch, i) in props.relevantPatches" :key="patch?.id">
      <span class="font-bold text-5xl text-primary-300">{{ patch?.id }}</span>

      <span v-if="i + 1 !== props.relevantPatches.length">{{ " " }}or{{ " " }}</span>
    </div>

    out yet?
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from "vue"

import type { Patch } from "../types"

const props = defineProps<{
  relevantPatches: Patch[]
}>()
</script>

<template>
  <div
    class="flex flex-col md:flex-row md:items-center md:gap-2 text-2xl md:text-4xl font-serif text-center"
  >
    Is

    <div
      v-for="(patch, i) in relevantPatches"
      :key="patch?.toString()"
      class="md:flex md:items-center md:gap-2"
    >
      <span v-if="i !== 0">{{ " " }}or{{ " " }}</span>

      <span class="font-bold text-5xl md:text-7xl text-primary-500">
        {{ patch?.toString() }}
      </span>
    </div>

    out yet?
  </div>
</template>

<script lang="ts" setup>
import { DotaPatchType, DotaVersion } from "dotaver"
import { computed } from "vue"

import type { Patch } from "../types"

const props = defineProps<{
  recentlyReleased: boolean
  latestPatch: Patch
}>()

const currentPatch = computed(() => DotaVersion.parse(props.latestPatch.id))
const nextPatches = computed(() => [
  currentPatch.value.next(DotaPatchType.Minor),
  currentPatch.value.next(DotaPatchType.Patch),
])

const relevantPatches = computed(() =>
  props.recentlyReleased ? [DotaVersion.parse(props.latestPatch.id)] : nextPatches.value,
)
</script>

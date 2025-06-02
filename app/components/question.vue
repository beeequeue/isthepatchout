<template>
  <div
    v-if="patch != null"
    class="flex flex-col text-center font-serif text-3xl md:flex-row md:items-center md:gap-2 md:text-4xl"
  >
    Is

    <div
      v-for="(patch, i) in relevantPatches"
      :key="patch?.toString()"
      class="md:flex md:items-center md:gap-2"
    >
      <span v-if="i !== 0">{{ " " }}or{{ " " }}</span>

      <span class="text-primary-500 text-7xl font-bold">
        {{ patch?.toString() }}
      </span>
    </div>

    out yet?
  </div>
</template>

<script lang="ts" setup>
import { DotaPatchType, DotaVersion } from "dotaver"

const { patch, recentlyReleased } = usePatch()

const currentPatch = computed(() => DotaVersion.parse(patch.value!.id))
const nextPatches = computed(() => [
  currentPatch.value.next(DotaPatchType.Minor),
  currentPatch.value.next(DotaPatchType.Patch),
])

const relevantPatches = computed(() =>
  recentlyReleased.value ? [currentPatch.value] : nextPatches.value,
)
</script>

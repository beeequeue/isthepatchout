<template>
  <main class="flex justify-center items-center h-1/1 p-5 text-center">
    <background-image />

    <content v-if="patch != null" />

    <div v-else class="text-3xl font-bold text-danger-300 text-shadow-lg">
      Could not find any patch data.
    </div>

    <client-only-empty>
      <change-detection v-if="patch != null" />
    </client-only-empty>

    <client-only-empty>
      <bottom-bar />
    </client-only-empty>

    <vite-pwa-manifest />
  </main>
</template>

<script lang="ts" setup>
const { patch, fetchPatch } = usePatch()

await fetchPatch()
</script>

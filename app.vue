<template>
  <main class="grid justify-items-center items-center h-1/1">
    <background-image />

    <content />

    <change-detection v-if="patch != null" />

    <bottom-bar />
  </main>
</template>

<script lang="ts" setup>
const { patch, fetchPatch } = usePatch()

await fetchPatch()
</script>

<template>
  <main class="flex justify-center items-center h-1/1">
    <background-image />

    <content />

    <client-only-empty>
      <change-detection v-if="patch != null" />
    </client-only-empty>

    <client-only-empty>
      <bottom-bar />
    </client-only-empty>
  </main>
</template>

<script lang="ts" setup>
const { patch, fetchPatch } = usePatch()

await fetchPatch()
</script>

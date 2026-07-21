<template>
  <main class="-mt-2 flex h-1/1 items-center justify-center p-5 text-center md:mt-0">
    <BackgroundImage />

    <Content v-if="patch != null" />

    <div v-else class="text-danger-300 text-3xl font-bold text-shadow-lg">
      Could not find any patch data.
    </div>

    <ClientOnlyEmpty>
      <ChangeDetection v-if="patch != null" />
    </ClientOnlyEmpty>

    <ClientOnlyEmpty>
      <BottomBar />
    </ClientOnlyEmpty>
  </main>
</template>

<script lang="ts" setup>
const { patch, fetchPatch } = usePatch()

await fetchPatch()
</script>

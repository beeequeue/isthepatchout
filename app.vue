<template>
  <NuxtPwaManifest />
  <SpeedInsights />

  <main class="flex justify-center items-center h-1/1 p-5 text-center">
    <BackgroundImage />

    <Content v-if="patch != null" />

    <div v-else class="text-3xl font-bold text-danger-300 text-shadow-lg">
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
import { SpeedInsights } from "@vercel/speed-insights/nuxt"

const { patch, fetchPatch } = usePatch()

await fetchPatch()
</script>

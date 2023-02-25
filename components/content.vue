<template>
  <section class="flex flex-shrink flex-col items-center">
    <question />

    <answer />

    <transition-expand :duration="500">
      <div v-if="!recentlyReleased" class="text-gray-400 mt-4">
        No need to refresh the page.
        <br />
        It will update as soon as we see a new update!
      </div>

      <patch-links v-else-if="recentlyReleased && links != null" :links="links" />
    </transition-expand>

    <celebration />
  </section>
</template>

<script lang="ts" setup>
const { patch, recentlyReleased } = usePatch()

const links = computed(() =>
  patch.value?.links?.length ?? 0 ? patch.value!.links : null,
)
</script>

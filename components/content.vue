<template>
  <section class="flex flex-shrink flex-col items-center">
    <question />

    <answer />

    <transition :duration="500">
      <div v-if="!recentlyReleased" class="text-center">
        No need to refresh the page.
        <br />
        It will update as soon as we see a new update!
      </div>
    </transition>

    <celebration />

    <links v-if="recentlyReleased && links != null" :links="links" />
  </section>
</template>

<script lang="ts" setup>
const { patch, recentlyReleased } = usePatch()

const links = computed(() => patch.value?.links ?? null)
</script>

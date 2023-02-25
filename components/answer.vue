<template>
  <div class="flex relative align-center font-serif pointer-events-none">
    <transition
      mode="out-in"
      class="duration-250"
      enter-active-class="ease-out"
      leave-active-class="ease-in"
      enter-from-class="transform -translate-x-full opacity-0"
      leave-to-class="transform translate-x-full opacity-0"
    >
      <div v-if="recentlyReleased" key="true" class="text-9xl md:text-12xl">Yes!</div>
      <div v-else key="false" class="text-10xl md:text-12xl">No.</div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
const { recentlyReleased } = usePatch()
</script>

<template>
  <div
    class="flex relative align-center font-serif text-10xl md:text-12xl pointer-events-none"
  >
    <transition
      mode="out-in"
      class="duration-250"
      enter-active-class="ease-out"
      leave-active-class="ease-in"
      enter-from-class="transform -translate-x-full opacity-0"
      leave-to-class="transform translate-x-full opacity-0"
    >
      <div v-if="recentlyReleased" key="true">Yes!</div>
      <div v-else key="false">No.</div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
const { recentlyReleased } = usePatch()
</script>

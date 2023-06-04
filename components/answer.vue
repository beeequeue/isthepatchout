<!-- eslint-disable vue/attribute-hyphenation -->

<template>
  <div class="flex relative align-center font-serif pointer-events-none">
    <transition
      mode="out-in"
      enterActiveClass="ease-out"
      leaveActiveClass="ease-in"
      enterFromClass="transform -translate-x-full opacity-0"
      leaveToClass="transform translate-x-full opacity-0"
    >
      <div v-if="recentlyReleased" key="true" class="text-9xl md:text-12xl duration-250">
        Yes!
      </div>
      <div v-else key="false" class="text-10xl md:text-12xl duration-250">No.</div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
const { recentlyReleased } = usePatch()
</script>

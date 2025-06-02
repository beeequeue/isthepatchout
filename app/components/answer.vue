<!-- eslint-disable vue/attribute-hyphenation -->

<template>
  <div class="align-center pointer-events-none relative flex font-serif">
    <transition
      mode="out-in"
      enterActiveClass="ease-out"
      leaveActiveClass="ease-in"
      enterFromClass="transform -translate-x-full opacity-0"
      leaveToClass="transform translate-x-full opacity-0"
    >
      <div v-if="recentlyReleased" key="true" class="md:text-12xl duration-250 text-9xl">
        Yes!
      </div>
      <div v-else key="false" class="text-10xl md:text-12xl duration-250">No.</div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
const { recentlyReleased } = usePatch()
</script>

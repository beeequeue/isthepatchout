<template>
  <div class="flex relative align-center font-serif text-12xl">
    <transition
      mode="out-in"
      class="duration-500 transition-fastest"
      enter-active-class="ease-out"
      leave-active-class="ease-in"
      enter-from-class="transform -translate-x-full opacity-0"
      leave-to-class="transform translate-x-full opacity-0"
    >
      <div v-if="released" key="true">Yes!</div>
      <div v-else key="false">No.</div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from "vue"

const props = defineProps<{ released: boolean }>()
</script>

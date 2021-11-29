<template>
  <component
    :is="is"
    class="clickable flex items-center p-2 bg-trans border-2 border-trans rounded-lg overflow-hidden cursor-pointer transition-bg duration-500 active:bg-gray-800 active:duration-50"
    :class="{ clicked, 'rounded-full': round }"
    @mousedown="clicked = false"
    @click="clicked = true"
  >
    <slot />
  </component>
</template>

<script lang="ts" setup>
import { ref, defineProps } from "vue"

defineProps({
  is: {
    type: String,
    default: "button",
  },
  round: {
    type: Boolean,
    default: false,
  },
})

const clicked = ref(false)
</script>

<style scoped>
@keyframes clicked {
  0% {
    border-color: transparent;
  }
  50% {
    border-color: #444;
  }
  100% {
    border-color: transparent;
  }
}

.clicked {
  animation: clicked 350ms forwards;
}
</style>

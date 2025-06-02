<template>
  <component
    :is="is ?? 'button'"
    class="clickable bg-trans border-trans transition-bg active:duration-50 flex cursor-pointer items-center overflow-hidden rounded-lg border-2 p-2 duration-500 focus-visible:bg-gray-800 active:bg-gray-800"
    :class="{ clicked, 'rounded-full': round }"
    @mousedown="clicked = false"
    @click="clicked = true"
  >
    <slot />
  </component>
</template>

<script lang="ts" setup>
defineProps<{ is?: string; round?: boolean }>()

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

.clickable {
  outline: 0;
}

.clicked {
  animation: clicked 350ms forwards;
}
</style>

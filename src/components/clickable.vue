<template>
  <component
    :is="props.is"
    class="clickable"
    :class="{ clicked }"
    @mousedown="clicked = false"
    @click="clicked = true"
  >
    <slot />
  </component>
</template>

<script lang="ts" setup>
import { ref, defineProps } from "vue"

const props = defineProps({
  is: {
    type: String,
    default: "div",
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

.clickable {
  display: flex;
  align-items: center;
  padding: 2px 6px;
  border: 2px solid transparent;
  border-radius: 10px;
  overflow: hidden;

  background: transparent;
  box-shadow: var(--shadows);

  user-select: none;
  cursor: pointer;

  transition: background 500ms, box-shadow 500ms;

  &:active {
    background: var(--bg-300);

    transition: background 50ms;
  }

  &.clicked {
    animation: clicked 350ms forwards;
  }
}
</style>

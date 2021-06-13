<template>
  <Clickable class="switch" :class="{ checked }" @click="emit('change')">
    <input
      hidden
      type="checkbox"
      name="notifications-enabled"
      :value="checked.toString()"
    />

    <slot />
  </Clickable>
</template>

<script lang="ts" setup>
import { defineProps, defineEmit } from "vue"

// @ts-ignore: Used component
import Clickable from "./clickable.vue"

defineProps<{ checked: boolean; circle?: boolean }>()
const emit = defineEmit(["change"])
</script>

<style scoped>
.switch {
  display: flex;

  padding: 8px;

  border-radius: v-bind("radius");
  overflow: hidden;

  cursor: pointer;

  & :deep(.icon) {
    height: 25px;
    width: 25px;
    pointer-events: none;

    filter: brightness(0.3) drop-shadow(0 0 4px transparent);

    transition: filter 250ms;
  }

  &.checked {
    & :deep(.icon) {
      filter: brightness(1) drop-shadow(0 0 4px rgba(200, 200, 200, 0.8));
    }
  }
}
</style>

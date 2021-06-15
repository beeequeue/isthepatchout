<template>
  <Clickable class="rounded-full" @click="emit('change')">
    <input
      hidden
      type="checkbox"
      name="notifications-enabled"
      :value="checked.toString()"
    />

    <slot :checked="checked" />
  </Clickable>
</template>

<script lang="ts" setup>
import { defineProps, defineEmit } from "vue"

import Clickable from "./clickable.vue"

defineProps<{ checked: boolean; circle?: boolean }>()
const emit = defineEmit<(type: "change") => void>()
</script>

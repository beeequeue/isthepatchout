<template>
  <span class="inline-flex items-center h-6 w-6 rounded-full select-none" v-html="icon" />
</template>

<script lang="ts" setup>
import { defineProps } from "vue"

defineProps<{ icon: string }>()
</script>

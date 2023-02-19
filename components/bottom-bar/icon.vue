<template>
  <span class="inline-flex items-center h-5 w-5 rounded-full select-none" v-html="icon" />
</template>

<script lang="ts" setup>
defineProps<{ icon: string }>()
</script>

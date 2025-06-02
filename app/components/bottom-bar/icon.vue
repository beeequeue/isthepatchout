<template>
  <span class="inline-flex h-5 w-5 select-none items-center rounded-full" v-html="icon" />
</template>

<script lang="ts" setup>
defineProps<{ icon: string }>()
</script>

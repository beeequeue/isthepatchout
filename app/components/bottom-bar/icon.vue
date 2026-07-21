<template>
  <span class="inline-flex h-5 w-5 items-center rounded-full select-none" v-html="icon" />
</template>

<script lang="ts" setup>
defineProps<{ icon: string }>()
</script>

<template>
  <Clickable
    is="a"
    :href="repositoryUrl"
    rel="noopener"
    target="_blank"
    class="m-2px flex items-center p-2"
  >
    <Icon name="simple-icons:github" class="mr-2 fill-gray-100" />

    Source code
  </Clickable>
</template>

<script lang="ts" setup>
const repositoryUrl = REPOSITORY
</script>

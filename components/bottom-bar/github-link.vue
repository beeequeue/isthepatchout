<template>
  <Clickable
    is="a"
    :href="pkgJson.repository"
    rel="noopener"
    target="_blank"
    class="m-2px flex items-center p-2"
  >
    <Icon name="simple-icons:github" class="mr-2 fill-gray-100" />

    Source code
  </Clickable>
</template>

<script lang="ts" setup>
import pkgJson from "../../package.json"
</script>

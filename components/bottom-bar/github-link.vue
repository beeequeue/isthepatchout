<template>
  <Clickable
    is="a"
    :href="pkgJson.repository"
    rel="noopener"
    target="_blank"
    class="flex items-center p-2 m-2px"
  >
    <Icon name="simple-icons:github" class="fill-gray-100 mr-2" />

    Source code
  </Clickable>
</template>

<script lang="ts" setup>
import pkgJson from "../../package.json"
</script>

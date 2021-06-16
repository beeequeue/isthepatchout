<template>
  <a :href="pkgJson.repository" rel="noopener" target="_blank" class="flex p-2 m-2px">
    <Icon
      :icon="githubIcon.svg"
      class="fill-gray-400 hover:fill-gray-100 transition-all"
    />
  </a>
</template>

<script lang="ts" setup>
import githubIcon from "simple-icons/icons/github"

import pkgJson from "../../package.json"

import Icon from "./icon.vue"
</script>

<template>
  <nav
    class="absolute bottom-0 md:relative flex flex-col justify-center items-center w-1/1 md:w-auto mt-auto md:mb-5 p-1 shadow-lg md:rounded-lg bg-gradient-to-br from-gray-900/75 to-gray-900/20 transition-all duration-500"
    :class="{ open }"
  >
    <Clickable
      v-if="isMobile"
      class="absolute top-0 right-0 !rounded-full transform -translate-y-full"
      @click="open = !open"
    >
      <Icon :icon="settingsSvg" class="h-8 w-8 p-0" />
    </Clickable>

    <Notifications />

    <DiscordLink />

    <GitHubLink />
  </nav>
</template>

<script lang="ts" setup>
import { ref } from "vue"

import settingsSvg from "../../assets/settings.svg?raw"
import Clickable from "../clickable.vue"

import DiscordLink from "./discord-link.vue"
import GitHubLink from "./github-link.vue"
import Icon from "./icon.vue"
import Notifications from "./notifications.vue"

const isMobile = window.outerWidth < 768
const open = ref(!isMobile)
</script>

<style scoped>
nav:not(.open) {
  transform: translateY(100%);
}
</style>

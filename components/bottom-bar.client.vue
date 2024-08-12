<template>
  <nav
    class="w-1/1 absolute bottom-0 mt-auto flex flex-col items-center justify-center bg-gradient-to-br from-gray-900/75 to-gray-900/20 p-1 shadow-lg transition-all duration-500 md:mb-5 md:w-auto md:rounded-lg"
    :class="{ open }"
  >
    <clickable
      v-if="isMobile"
      class="absolute top-0 right-0 -translate-y-full transform !rounded-full"
      @click="open = !open"
    >
      <IconCSS name="pajamas:settings" class="h-8 w-8 p-0" />
    </clickable>

    <Notifications />

    <DiscordLink />

    <GitHubLink />
  </nav>
</template>

<script lang="ts" setup>
import DiscordLink from "./bottom-bar/discord-link.vue"
import GitHubLink from "./bottom-bar/github-link.vue"
import Notifications from "./bottom-bar/notifications.client.vue"

const windowSize = useWindowSize()
const isMobile = computed(() => windowSize.width.value < 768)
const open = ref(!isMobile.value)
</script>

<style scoped>
nav:not(.open) {
  transform: translateY(100%);
}
</style>

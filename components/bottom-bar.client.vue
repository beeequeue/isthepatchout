<template>
  <nav
    class="absolute bottom-0 mb-5 mt-auto flex w-auto flex-col items-center justify-center rounded-lg bg-gradient-to-br from-gray-800/40 to-slate-900/40 p-1 shadow-lg transition-all duration-500"
  >
    <Notifications />

    <DiscordLink />

    <GitHubLink />
  </nav>
</template>

<script lang="ts" setup>
import DiscordLink from "./bottom-bar/discord-link.vue"
import GitHubLink from "./bottom-bar/github-link.vue"
import Notifications from "./bottom-bar/notifications.client.vue"
</script>

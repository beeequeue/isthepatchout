<template>
  <Clickable is="a" :href="url" rel="noopener" class="flex items-center p-2 m-2px">
    <Icon :icon="discordIcon.svg" class="fill-gray-100 mr-2" />

    Get notified in Discord
  </Clickable>
</template>

<script lang="ts" setup>
import discordIcon from "simple-icons/icons/discord"

import Clickable from "../clickable.vue"

import Icon from "./icon.vue"

/* eslint-disable @typescript-eslint/naming-convention */
const searchParams = new URLSearchParams({
  scope: "webhook.incoming",
  response_type: "code",
  client_id: "945801741864165427",
  redirect_uri: encodeURI(
    `${import.meta.env.VITE_API_URL as string}/api/callback/discord`,
  ),
})
const url = new URL(`https://discord.com/api/oauth2/authorize?${searchParams.toString()}`)
</script>

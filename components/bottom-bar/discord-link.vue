<template>
  <Clickable is="a" :href="url" rel="noopener" class="flex items-center p-2 m-2px">
    <IconCSS name="simple-icons:discord" class="fill-gray-100 mr-2" />

    Get notified in Discord
  </Clickable>
</template>

<script lang="ts" setup>
const config = useRuntimeConfig()

/* eslint-disable @typescript-eslint/naming-convention */
const searchParams = new URLSearchParams({
  scope: "webhook.incoming",
  response_type: "code",
  client_id: "945801741864165427",
  redirect_uri: encodeURI(`${config.public.apiUrl}/api/callback/discord`),
})
const url = new URL(`https://discord.com/api/oauth2/authorize?${searchParams.toString()}`)
</script>

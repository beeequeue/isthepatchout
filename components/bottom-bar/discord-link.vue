<template>
  <Clickable is="a" :href="url" rel="noopener" class="m-2px flex items-center p-2">
    <Icon name="simple-icons:discord" class="mr-2 fill-gray-100" />

    Get notified in Discord
  </Clickable>
</template>

<script lang="ts" setup>
const config = useRuntimeConfig()

const searchParams = new URLSearchParams({
  scope: "webhook.incoming",
  response_type: "code",
  client_id: "945801741864165427",
  redirect_uri: encodeURI(`${config.public.apiUrl}/api/callback/discord`),
})
const url = new URL(`https://discord.com/api/oauth2/authorize?${searchParams.toString()}`)
</script>

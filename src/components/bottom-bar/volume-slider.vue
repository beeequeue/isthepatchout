<template>
  <div class="flex items-center p-2">
    <Icon
      class="!h-7 !w-7 mr-2 cursor-pointer"
      :icon="volume > 0 ? volumeSvg : mutedSvg"
      @click="muteOrUnmute"
    />

    <input
      v-model.number="volume"
      type="range"
      min="0"
      max="1"
      step="0.01"
      class="max-w-35"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"

import mutedSvg from "../../assets/muted.svg?raw"
import volumeSvg from "../../assets/volume.svg?raw"
import { volume } from "../../hooks/volume"

import Icon from "./icon.vue"

const lastVolume = ref(volume.value || 0.5)

const muteOrUnmute = () => {
  if (volume.value === 0) {
    volume.value = lastVolume.value
  } else {
    lastVolume.value = volume.value
    volume.value = 0
  }
}

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

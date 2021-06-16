<template>
  <ToggleButton circle :checked="subscribed" @change="handleChange">
    <Icon
      class="h-6 w-6 hover:fill-gray-100 animate-infinite animate-slow transition-all"
      :class="iconClasses"
      :icon="subscribed ? alertSvg : noAlertSvg"
    />
  </ToggleButton>
</template>

<script lang="ts" setup>
import { computed } from "vue"

import alertSvg from "../assets/alert.svg?raw"
import noAlertSvg from "../assets/no-alert.svg?raw"
import { usePushNotifications } from "../hooks/use-push-notifications"

import Icon from "./icon.vue"
import ToggleButton from "./toggle-button.vue"

const { supported, loading, subscribing, subscribed, askForPermissions, unsubscribe } =
  usePushNotifications()

const iconClasses = computed(() => ({
  "animate-heartBeat": subscribing.value,
  "grayed-out": !supported || loading.value,
  "fill-gray-400": !subscribed.value,
  shine: subscribed.value,
}))

const handleChange = () => {
  if (subscribed.value) {
    return unsubscribe()
  }

  void askForPermissions()
}
</script>

<style scoped>
.shine {
  filter: drop-shadow(0 0 4px #ccc);
}
</style>

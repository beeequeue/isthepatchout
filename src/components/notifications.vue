<template>
  <section class="!loading && supported">
    <ToggleButton circle :checked="subscribed" @change="handleChange">
      <span
        class="h-6 w-6 animate-infinite animate-slow transition-all"
        :class="iconClasses"
        v-html="subscribed ? alertSvg : noAlertSvg"
      />
    </ToggleButton>
  </section>
</template>

<script lang="ts" setup>
import { computed } from "vue"

import alertSvg from "../assets/alert.svg?raw"
import noAlertSvg from "../assets/no-alert.svg?raw"
import { usePushNotifications } from "../hooks/use-push-notifications"

import ToggleButton from "./toggle-button.vue"

const { supported, loading, subscribing, subscribed, askForPermissions, unsubscribe } =
  usePushNotifications()

const iconClasses = computed(() => ({
  "animate-heartBeat": subscribing.value,
  "grayed-out": !supported || loading.value,
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

<template>
  <toggle-button
    v-if="supported"
    circle
    :checked="subscribed"
    class="text-base"
    @change="handleChange"
  >
    <div
      class="animate-infinite animate-slow mr-2 transition-all hover:fill-gray-100"
      :class="iconClasses"
    />

    {{ subscribed ? "Disable" : "Enable" }} push notifications
  </toggle-button>
</template>

<script lang="ts" setup>
const config = useRuntimeConfig()

const { supported, loading, subscribing, subscribed, askForPermissions, unsubscribe } =
  usePushNotifications(config.public.apiUrl, config.public.vapidPublicKey)

const iconClasses = computed(() => ({
  "animate-heartBeat": subscribing.value,
  "grayed-out": !supported || loading.value,
  "fill-gray-400": !subscribed.value,
  shine: subscribed.value,
  "i-tabler:bell-off": subscribed,
  "i-tabler:bell-filled": !subscribed,
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

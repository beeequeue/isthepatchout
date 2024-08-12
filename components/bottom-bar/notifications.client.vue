<template>
  <toggle-button
    v-if="supported"
    circle
    :checked="subscribed"
    class="text-base"
    @change="handleChange"
  >
    <Icon
      class="mr-2 hover:fill-gray-100 animate-infinite animate-slow transition-all"
      :class="iconClasses"
      :name="subscribed ? 'tabler:bell-off' : 'tabler:bell-filled'"
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

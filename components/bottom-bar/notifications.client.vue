<template>
  <ToggleButton circle :checked="subscribed" class="text-base" @change="handleChange">
    <IconCSS
      class="h-5 w-5 mr-2 hover:fill-gray-100 animate-infinite animate-slow transition-all"
      :class="iconClasses"
      :name="subscribed ? 'pajamas:notifications' : 'pajamas:notifications-off'"
    />

    {{ subscribed ? "Disable" : "Enable" }} push notifications
  </ToggleButton>
</template>

<script lang="ts" setup>
const { supported, loading, subscribing, subscribed, askForPermissions, unsubscribe } =
  usePushNotifications()

const iconClasses = computed(() => ({
  /* eslint-disable @typescript-eslint/naming-convention */
  "animate-heartBeat": subscribing.value,
  "grayed-out": !supported || loading.value,
  "fill-gray-400": !subscribed.value,
  /* eslint-enable */
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

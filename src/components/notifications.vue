<template>
  <section v-if="canUseNotifications && !canNotify" class="notifications">
    <button @click="askForPermissions">
      <img :src="alertSvg" />

      Get a notification when the patch comes
    </button>
  </section>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue"

import alertSvg from "../assets/alert.svg"
import { useServiceWorker } from "../hooks/use-service-worker"

const { registration, applicationServerKey } = useServiceWorker()

const canUseNotifications =
  "Notification" in window &&
  "showNotification" in ServiceWorkerRegistration.prototype &&
  "PushManager" in window

const canNotify = ref(Notification.permission === "granted")
const subscription = ref<PushSubscription | null>(null)

const askForPermissions = async () => {
  const result = await Notification.requestPermission()

  if (result === "granted") {
    canNotify.value = true
  }
}

watch(
  () => canNotify.value && registration.value == null,
  async () => {
    if (!canNotify.value || registration.value == null || subscription.value != null) {
      return
    }

    subscription.value = await registration.value.pushManager.getSubscription()

    if (subscription.value) {
      return console.table(subscription.value)
    }

    const newSubscription = await registration.value.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    })
    console.table(newSubscription)
  },
)
</script>

<style scoped>
button {
  display: flex;
  align-items: center;
  gap: 10px;

  color: #eee;
  border: 0;

  padding: 10px 20px;
  border-radius: 15px;
  background: linear-gradient(145deg, #0f0f0f, #121212);
  box-shadow: 8px 8px 16px #070707, -6px -6px 16px #161616;

  cursor: pointer;

  transition: transform 25ms;
}

button > img {
  height: 1.5em;
  width: 1.5em;
}

button:hover {
  transform: scale(1.01);
}

button:active {
  transform: scale(1);
}
</style>

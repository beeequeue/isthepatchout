<template>
  <section v-if="canUseNotifications && !canNotify" class="notifications">
    <button @click="askForPermissions">
      <img :src="alertSvg" />

      Get a notification when the patch comes
    </button>
  </section>
</template>

<script lang="ts" setup>
import { ref } from "vue"

import alertSvg from "../assets/alert.svg"

const canUseNotifications = "Notification" in window

const canNotify = ref(Notification.permission === "granted")

const askForPermissions = async () => {
  const result = await Notification.requestPermission()

  if (result === "granted") {
    canNotify.value = true
  }
}
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

<template>
  <section v-if="canUseNotifications && !canNotify" class="notifications">
    <button @click="askForPermissions">
      <span>BELL</span>

      Get a notification when the patch comes
    </button>
  </section>
</template>

<script lang="ts" setup name="Button">
import { ref } from "vue"

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
  color: #eee;
  border: 0;

  padding: 18px 20px;
  border-radius: 15px;
  background: linear-gradient(145deg, #0f0f0f, #121212);
  box-shadow: 8px 8px 16px #0c0c0c, -8px -8px 16px #161616;

  cursor: pointer;

  transition: transform 25ms;
}

button:hover {
  transform: scale(1.01);
}

button:active {
  transform: scale(1);
}
</style>

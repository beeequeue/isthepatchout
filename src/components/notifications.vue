<template>
  <transition>
    <section v-if="!loading && supported" class="notifications">
      <button @click="askForPermissions">
        <img :src="alertSvg" />

        Get a notification when the patch comes
      </button>
    </section>
  </transition>
</template>

<script lang="ts" setup>
import alertSvg from "../assets/alert.svg"
import { usePushNotifications } from "../hooks/use-push-notifications"

const { supported, loading, askForPermissions } = usePushNotifications()
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

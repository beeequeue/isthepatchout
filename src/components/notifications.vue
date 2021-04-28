<template>
  <transition>
    <section v-if="!loading && supported" class="notifications">
      <ToggleButton circle :checked="subscribed" @change="handleChange">
        <img class="icon" :src="subscribed ? alertSvg : noAlertSvg" />
      </ToggleButton>

      Notifications
    </section>
  </transition>
</template>

<script lang="ts" setup>
import alertSvg from "../assets/alert.svg"
import noAlertSvg from "../assets/no-alert.svg"
import { usePushNotifications } from "../hooks/use-push-notifications"

import ToggleButton from "./toggle-button.vue"

const { supported, loading, subscribed, askForPermissions } = usePushNotifications()

const handleChange = () => {
  if (subscribed.value) {
    return // TODO
  }

  void askForPermissions()
}
</script>

<style scoped>
.notifications {
  display: flex;
  align-items: center;
  font-size: 1.25em;

  & > button {
    margin-right: 12px;
  }

  transition: opacity 1s;

  &.v-enter-from {
    opacity: 0;
  }
}

button {
  display: flex;
  align-items: center;
  gap: 10px;

  color: #eee;
  border: 0;

  padding: 10px 20px;
  background: none;

  cursor: pointer;

  transition: transform 25ms;

  & > img {
    height: 1.5em;
    width: 1.5em;
  }
}
</style>

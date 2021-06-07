<template>
  <transition>
    <section v-if="!loading && supported" class="notifications">
      <ToggleButton circle :checked="subscribed" @change="handleChange">
        <img
          class="icon"
          :class="{ subscribing }"
          :src="subscribed ? alertSvg : noAlertSvg"
        />
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

const { supported, loading, subscribing, subscribed, askForPermissions, unsubscribe } =
  usePushNotifications()

const handleChange = () => {
  // eslint-disable-next-line no-unreachable
  if (subscribed.value) {
    return unsubscribe()
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

@keyframes spin {
  from {
    transform: rotateZ(0deg);
  }
  to {
    transform: rotateZ(360deg);
  }
}

.subscribing {
  animation: spin 0.5s linear infinite;
}
</style>

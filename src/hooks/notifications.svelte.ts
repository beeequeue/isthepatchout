import { untrack } from "svelte"

import { useServiceWorker } from "#/hooks/service-worker.svelte.ts"
import { subscribe, unsubscribe } from "#/routes/subscription.remote.ts"
import { localStorageStore } from "#/stores/localstorage.svelte.ts"
import { browser } from "$app/env"
import { VAPID_PUBLIC_KEY } from "$app/env/public"

const NotificationsEnabled = "itpo-notif-enabled"

export function usePushNotifications() {
  const supported =
    browser &&
    "Notification" in window &&
    "PushManager" in window &&
    "showNotification" in ServiceWorkerRegistration.prototype

  const registration = useServiceWorker()
  const enabled = localStorageStore(NotificationsEnabled, false)

  const state = $state({
    subscribed: false,
    subscribing: false,
  })

  // Idempotent: safe to call on every page load so the server always knows
  // about existing subscriptions.
  const sync = async () => {
    if (
      !supported ||
      registration.current == null ||
      Notification.permission !== "granted" ||
      !enabled.value ||
      state.subscribing
    ) {
      return
    }

    state.subscribing = true

    try {
      const subscription =
        (await registration.current.pushManager.getSubscription()) ??
        (await registration.current.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: VAPID_PUBLIC_KEY,
        }))

      await subscribe(subscription.toJSON() as never)
      state.subscribed = true
    } finally {
      state.subscribing = false
    }
  }

  const enable = async () => {
    if (!supported || (await Notification.requestPermission()) !== "granted") return

    enabled.value = true
    await sync()
  }

  const disable = async () => {
    enabled.value = false

    const subscription = await registration.current?.pushManager.getSubscription()

    if (subscription) {
      await subscription.unsubscribe()
      await unsubscribe(subscription.endpoint)
    }

    state.subscribed = false
  }

  // Re-sync on load whenever the user previously enabled notifications.
  $effect(() => {
    if (!supported || !enabled.value || state.subscribed || state.subscribing) return
    if (registration.current == null) return

    untrack(() => void sync())
  })

  return { supported, state, enable, disable }
}

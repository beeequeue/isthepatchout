import { LocalStorageKey } from "~~/lib/constants"

type ApiResponse<T extends Record<string, unknown>> = T & {
  ok: boolean
}

const loading = ref(true)

const supported =
  "Notification" in window &&
  "showNotification" in ServiceWorkerRegistration.prototype &&
  "PushManager" in window

const permissionsGranted = ref(supported ? Notification.permission === "granted" : false)

const askForPermissions = async () => {
  const result = await Notification.requestPermission()

  if (result === "granted") {
    manuallyDisabled.value = false
    permissionsGranted.value = true
  }
}

const subscription = ref<PushSubscription | null>(null)
const subscribing = ref(false)
const subscribed = ref(false)
const manuallyDisabled = useLocalStorage(LocalStorageKey.ManuallyDisabled, false)

export const usePushNotifications = (baseUrl: string, vapidPublicKey: string) => {
  const { registration, applicationServerKey } = useServiceWorker(vapidPublicKey)

  const registerNewSubscription = async () => {
    const subscriptionData = JSON.parse(JSON.stringify(subscription.value))

    await $fetch(`${baseUrl}/api/subscription`, {
      method: "POST",
      body: JSON.stringify(subscriptionData),
    })
  }

  const unsubscribe = async () => {
    if (subscription.value == null) return

    const { endpoint } = subscription.value

    await subscription.value.unsubscribe()
    manuallyDisabled.value = true
    subscribed.value = false
    subscription.value = null

    const params = new URLSearchParams({ endpoint })
    await $fetch(`${baseUrl}/api/subscription?${params.toString()}`, {
      method: "DELETE",
    })
  }

  const getIsSubscriptionValid = async (endpoint: string): Promise<boolean> => {
    const params = new URLSearchParams({ endpoint })

    try {
      const data = await $fetch<ApiResponse<{ exists: boolean }>>(
        `${baseUrl}/api/subscription?${params.toString()}`,
        { responseType: "json" },
      )

      return data.exists
    } catch (error) {
      throw new Error(`Couldn't fetch subscription status.`, {
        cause: error,
      })
    }
  }

  watch(
    registration,
    () => {
      if (/*config.public.PROD &&*/ registration.value == null) return

      loading.value = false
    },
    { immediate: true },
  )

  watch([permissionsGranted, registration, manuallyDisabled], async () => {
    if (!permissionsGranted.value || registration.value == null) return

    subscription.value = await registration.value.pushManager.getSubscription()

    if (subscription.value != null) {
      subscribed.value = await getIsSubscriptionValid(subscription.value.endpoint)

      if (subscribed.value) return
    }

    if (manuallyDisabled.value) return

    subscription.value = await registration.value.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey,
    })

    subscribing.value = true

    await registerNewSubscription()

    subscribing.value = false
    subscribed.value = true
  })

  return {
    supported,
    loading,
    subscribed,
    subscribing,
    askForPermissions,
    unsubscribe,
  }
}

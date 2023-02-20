import { LocalStorageKey } from "@/lib/constants"

import { useServiceWorker } from "./use-service-worker"

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

const config = useRuntimeConfig()
const { registration, applicationServerKey } = useServiceWorker()
const subscription = ref<PushSubscription | null>(null)
const subscribing = ref(false)
const subscribed = ref(false)
const manuallyDisabled = useLocalStorage(LocalStorageKey.ManuallyDisabled, false)

const registerNewSubscription = async () => {
  const subscriptionData = JSON.parse(JSON.stringify(subscription.value))

  await fetch(`${config.public.apiUrl}/api/subscription`, {
    method: "POST",
    // eslint-disable-next-line @typescript-eslint/naming-convention
    headers: { "content-type": "application/json" },
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
  await fetch(`${config.public.apiUrl}/api/subscription?${params.toString()}`, {
    method: "DELETE",
  })
}

const getIsSubscriptionValid = async (endpoint: string): Promise<boolean> => {
  const params = new URLSearchParams({ endpoint })

  const response = await fetch(
    `${config.public.apiUrl}/api/subscription?${params.toString()}`,
  )

  if (
    !response.ok ||
    !response.headers.get("content-type")?.includes("application/json")
  ) {
    throw new Error(`Couldn't fetch subscription status (${response.statusText})`)
  }

  const data = await response.json()
  if (!data.ok) {
    throw new Error(
      `Couldn't fetch subscription status\n${JSON.stringify(data, null, 2)}`,
    )
  }

  return data.exists
}

watch(
  registration,
  () => {
    if (config.public.PROD && registration.value == null) return

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

export const usePushNotifications = () => ({
  supported,
  loading,
  subscribed,
  subscribing,
  askForPermissions,
  unsubscribe,
})

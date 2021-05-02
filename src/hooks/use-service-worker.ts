import { ref } from "vue"

// https://www.npmjs.com/package/web-push#using-vapid-key-for-applicationserverkey
const urlBase64ToUint8Array = (base64String: string) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

const applicationServerKey = urlBase64ToUint8Array(
  import.meta.env.VITE_VAPID_PUBLIC_KEY as string,
)

const registration = ref<ServiceWorkerRegistration>()

void navigator.serviceWorker.ready.then((newRegistration) => {
  registration.value = newRegistration
})

export const useServiceWorker = () => {
  return {
    applicationServerKey,
    registration,
  }
}

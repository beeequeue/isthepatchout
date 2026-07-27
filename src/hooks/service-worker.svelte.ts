import { onMount } from "svelte"

let registration = $state<ServiceWorkerRegistration>()

export const useServiceWorker = () => {
  onMount(() => {
    void navigator.serviceWorker.ready.then((newRegistration) => {
      registration = newRegistration
    })
  })

  return {
    get current() {
      return registration
    },
  }
}

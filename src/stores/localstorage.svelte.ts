import { browser } from "$app/env"

export function localStorageStore<T>(key: "itpo-notif-enabled", initial: T) {
  let stored = $state<T>(
    !browser ? initial : (JSON.parse(localStorage.getItem(key) ?? JSON.stringify(initial)) as T),
  )

  return {
    get value() {
      return stored
    },
    set value(incoming: T) {
      stored = incoming
      if (browser) {
        localStorage.setItem(key, JSON.stringify(incoming))
      }
    },
  }
}

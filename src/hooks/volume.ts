import { ref, watch } from "vue"

import { LocalStorageKey } from "../constants"

const initalVolume = Number(localStorage.getItem(LocalStorageKey.Volume) ?? 0.5)
const isChrome = navigator.userAgent.includes("Chrome/")

export const volume = ref(isChrome ? 0 : initalVolume)

export const canPlayAudio = ref(true)

const testAudio = new Audio()
testAudio.play().catch(() => {
  if (!isChrome) {
    canPlayAudio.value = false
  }
})

watch(volume, (newVolume) => {
  localStorage.setItem(LocalStorageKey.Volume, newVolume.toString())
})

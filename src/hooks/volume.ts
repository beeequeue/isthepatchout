import { ref, watch } from "vue"

export const volume = ref(Number(localStorage.getItem("volume") ?? 0.5))

watch(volume, (newVolume) => {
  localStorage.setItem("volume", newVolume.toString())
})

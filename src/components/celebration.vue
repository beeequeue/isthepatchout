<!-- eslint-disable-next-line -->
<template></template>

<script lang="ts" setup>
import confetti from "canvas-confetti"
import { ref, watch } from "vue"

import matchfoundSoundUrl from "../assets/matchfound.mp3"

const props = defineProps<{ releasedWhileOpen: boolean }>()

const audioReady = ref(false)
const audio = new Audio(matchfoundSoundUrl)
audio.autoplay = false
audio.volume = 0.5
audio.addEventListener("canplaythrough", () => {
  audioReady.value = true
})

const fireConfetti = () => {
  void confetti({
    particleCount: 10,
    spread: 75,
    angle: 45,
    origin: { x: 0, y: 0.5 },
  })
  void confetti({
    particleCount: 10,
    spread: 75,
    angle: 145,
    origin: { x: 1, y: 0.5 },
  })
}

watch([() => props.releasedWhileOpen, audioReady], async ([released, ready]) => {
  if (!released || !ready) return

  audio.currentTime = 0
  void audio.play()

  const interval = setInterval(fireConfetti, 100)
  setTimeout(() => clearInterval(interval), 30_000)
})
</script>

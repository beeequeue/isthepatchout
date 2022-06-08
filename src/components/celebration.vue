<!-- eslint-disable-next-line -->
<template></template>

<script lang="ts" setup>
import confetti from "canvas-confetti"
import { watch } from "vue"

const props = defineProps<{
  recentlyReleased: boolean
  initialReleasedValue: boolean | null
}>()

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

watch([() => props.recentlyReleased], ([released]) => {
  if (props.initialReleasedValue || !released) return

  const interval = setInterval(fireConfetti, 100)
  setTimeout(() => clearInterval(interval), 30_000)
})
</script>

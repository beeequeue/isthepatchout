<template></template>

<script lang="ts" setup>
import confetti from "canvas-confetti"

import { Patch } from "@/lib/types"

const props = defineProps<{ patch: Patch }>()

const particleCount = window.innerWidth > 600 ? 10 : 4

const fireConfetti = () => {
  void confetti({
    particleCount,
    spread: 75,
    angle: 45,
    origin: { x: 0, y: 0.5 },
  })
  void confetti({
    particleCount,
    spread: 75,
    angle: 145,
    origin: { x: 1, y: 0.5 },
  })
}

watch(
  () => isRecentlyReleased(props.patch),
  (isRecent) => {
    if (/*state.releasedBeforeOpen ||*/ !isRecent) return

    // document.title = `${state.latestPatch!.id} is out!`

    const interval = setInterval(fireConfetti, 100)
    setTimeout(() => clearInterval(interval), 30_000)
  },
)
</script>

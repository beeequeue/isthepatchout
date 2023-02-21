<template>
  <span v-if="false" />
</template>

<script lang="ts" setup>
import confetti from "canvas-confetti"

const { patch, recentlyReleased } = usePatch()

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

watch(recentlyReleased, (isRecent) => {
  if (/*state.releasedBeforeOpen ||*/ !isRecent) return

  document.title = `${patch.value!.id} is out!`

  const interval = setInterval(fireConfetti, 100)
  setTimeout(() => clearInterval(interval), 30_000)
})
</script>

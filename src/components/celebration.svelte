<script lang="ts">
  import confetti from "canvas-confetti"
  import { untrack } from "svelte"

  import { usePatch } from "#/hooks/patch.svelte.ts"
  import { browser } from "$app/env"

  if (browser) {
    const state = usePatch()

    const colors = ["#BF2E1A", "#598307", "#c7b12f"]
    const particleCount = window.innerWidth > 600 ? 25 : 10
    const config = {
      spread: 75,
      angle: 45,
      particleCount,
      colors,
      origin: { x: -0.05, y: 0.5 },
    } satisfies confetti.Options
    const rightConfig = {
      ...config,
      angle: 145,
      origin: { x: 1.05, y: 0.5 },
    } satisfies confetti.Options

    let fireFromRight = false
    const fireConfetti = () => {
      confetti(!fireFromRight ? config : rightConfig)
      fireFromRight = !fireFromRight
    }
    let titleEven = true
    const updateTitle = () => {
      document.title = `${titleEven ? "✴︎" : "✺"} ${state.patch!.id} is out! ${titleEven ? "✺" : "✴︎"}`
      titleEven = !titleEven
    }

    $effect(() => {
      if (!state.recentlyReleased) return
      if (untrack(() => state.releasedBeforeOpening)) return

      updateTitle()

      fireConfetti()
      const confettiInterval = setInterval(fireConfetti, 150)
      const titleInterval = setInterval(updateTitle, 1000)

      const timeout = setTimeout(() => {
        clearInterval(confettiInterval)
        clearInterval(titleInterval)
      }, 30_000)

      return () => {
        clearInterval(confettiInterval)
        clearInterval(titleInterval)
        clearTimeout(timeout)
      }
    })
  }
</script>

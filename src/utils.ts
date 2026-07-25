import { onMount } from "svelte"

const secondIntervalListeners = new Set<() => void>()

let interval: number
function initSecondInterval() {
  if (interval != null) return

  onMount(() => {
    setTimeout(
      () => {
        secondIntervalListeners.forEach((fn) => fn())

        interval = setInterval(
          () => secondIntervalListeners.forEach((fn) => fn()),
          1000,
        ) as unknown as number
      },
      1000 - (Date.now() % 1000),
    )
  })
}

export function useSecondInterval(fn: () => void) {
  onMount(() => {
    secondIntervalListeners.add(fn)

    return () => {
      secondIntervalListeners.delete(fn)
    }
  })
  initSecondInterval()
}

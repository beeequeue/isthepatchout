<script lang="ts">
  import { cubicIn, cubicOut } from "svelte/easing"
  import type { TransitionConfig } from "svelte/transition"

  import { usePatch } from "#/hooks/patch.svelte.ts"

  const patchState = usePatch()

  let displayed = $state(patchState.recentlyReleased)
  let pending = $state(patchState.recentlyReleased)
  let visible = $state(true)

  $effect(() => {
    pending = patchState.recentlyReleased

    if (pending !== displayed && visible) {
      visible = false
    }
  })

  function enterFromLeft(_?: unknown): TransitionConfig {
    return {
      duration: 250,
      easing: cubicOut,
      css: (t) => `
        opacity: ${t};
        transform: translateX(${(1 - t) * -100}%);
      `,
    }
  }

  function leaveToRight(_?: unknown): TransitionConfig {
    return {
      duration: 250,
      easing: cubicIn,
      css: (t) => `
        opacity: ${t};
        transform: translateX(${(1 - t) * 100}%);
      `,
    }
  }

  function handleOutroEnd() {
    displayed = pending
    visible = true
  }
</script>

<div class="align-center pointer-events-none relative flex font-serif">
  {#if visible}
    <h1 class="m-0 my-4 text-8xl" in:enterFromLeft out:leaveToRight onoutroend={handleOutroEnd}>
      {displayed ? "Yes!" : "No."}
    </h1>
  {/if}
</div>

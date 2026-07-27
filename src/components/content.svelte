<script lang="ts">
  import type { Component } from "svelte"
  import { slide } from "svelte/transition"

  import { usePatch } from "#/hooks/patch.svelte.ts"

  import Answer from "./answer.svelte"
  // import Celebration from "./celebration.svelte"
  import Question from "./question.svelte"

  const patchState = usePatch()

  const links = $derived(patchState.patch?.links?.length ? patchState.patch.links : null)

  const loadCelebration = async () => (await import("./celebration.svelte")).default
  let Celebration = $state<Component>()
  $effect(() => {
    if (!patchState.recentlyReleased) return
    void loadCelebration().then((component) => {
      Celebration = component
    })
  })
</script>

<section class="flex flex-shrink flex-col items-center font-sans">
  <Question />

  <Answer />

  {#if !patchState.recentlyReleased}
    <div class="mt-4 text-center text-gray-400" transition:slide={{ duration: 500 }}>
      No need to refresh the page.
      <br />
      It will update as soon as we see a new update!
    </div>
  {:else if links !== null}
    <div transition:slide={{ duration: 500 }}>
      <!--      <PatchLinks {links} />-->
    </div>
  {/if}

  {#if patchState.recentlyReleased}
    <Celebration />
  {/if}
</section>

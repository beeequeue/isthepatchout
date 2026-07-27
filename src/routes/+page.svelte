<script lang="ts">
  import BottomBar from "#/components/bottom-bar.svelte"
  import Content from "#/components/content.svelte"
  import Metainfo from "#/components/metainfo.svelte"
  import { usePatch } from "#/hooks/patch.svelte.ts"

  import { getLatestPatch, subscribeToPatchData } from "./patch.remote.ts"

  const state = usePatch()

  const latest = await getLatestPatch()
  if (latest != null) {
    state.set(latest)
    if (state.recentlyReleased) {
      state.setReleasedBeforeOpening(true)
    }
  }

  ;(async () => {
    for await (const data of subscribeToPatchData()) {
      state.setReleasedBeforeOpening(false)
      state.set(data)
    }
  })()
</script>

<svelte:head>
  <title>Is the Patch Out? ༼ つ ◕_◕ ༽つ</title>
  <!-- <meta name="description" content="what would i even put here" /> -->
</svelte:head>

<Metainfo />

{#if state.patch != null}
  <Content />
{:else}
  <div class="text-danger-300 font-sans text-3xl font-bold text-shadow-lg">
    Could not find any patch data.
  </div>
{/if}

<BottomBar />

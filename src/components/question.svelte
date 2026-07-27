<script lang="ts">
  import { DotaPatchType, DotaVersion } from "dotaver"

  import { usePatch } from "#/hooks/patch.svelte.ts"

  const patchState = usePatch()

  const currentPatch = $derived(DotaVersion.parse(patchState.patch!.id))
  const nextPatches = $derived([
    currentPatch.next(DotaPatchType.Minor),
    currentPatch.next(DotaPatchType.Patch),
  ])

  const relevantPatches = $derived.by(() =>
    patchState.recentlyReleased ? [currentPatch] : nextPatches,
  )
</script>

{#if patchState.patch != null}
  <div
    class="flex flex-col text-center font-serif text-3xl md:flex-row md:items-center md:gap-2 md:text-4xl"
  >
    Is

    {#each relevantPatches as patch, i (patch?.toString())}
      <div class="md:flex md:items-center md:gap-2">
        {#if i !== 0}
          <span> or </span>
        {/if}

        <span class="text-amber-5 text-7xl font-bold">
          {patch?.toString()}
        </span>
      </div>
    {/each}

    out yet?
  </div>
{/if}

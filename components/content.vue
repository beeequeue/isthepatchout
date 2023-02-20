<template>
  <section class="flex flex-shrink flex-col items-center">
    <question
      v-if="props.patch != null"
      :recently-released="props.recentlyReleased"
      :latest-patch="patch"
    />

    <answer :released="props.recentlyReleased" />

    <transition :duration="500">
      <div v-if="!props.recentlyReleased" class="text-center">
        No need to refresh the page.
        <br />
        It will update as soon as we see a new update!
      </div>
    </transition>

    <!--    <celebration :patch="patch" />-->

    <links v-if="props.recentlyReleased && links" :links="links" />
  </section>
</template>

<script lang="ts" setup>
import { Patch } from "@/lib/types"

const props = defineProps<{
  patch: Patch | null
  recentlyReleased: boolean
}>()

const links = computed(() => props.patch?.links ?? null)
</script>

<template>
  <section class="flex flex-shrink flex-col items-center">
    <Question :relevant-patches="relevantPatches" />

    <Answer :released="recentlyReleased" />

    <CollapseTransition :duration="500">
      <div v-if="!recentlyReleased" class="text-center">
        No need to refresh the page.
        <br />
        It will update as soon as we see a new update!
      </div>
    </CollapseTransition>

    <Links v-if="recentlyReleased && links" :links="links" />
  </section>
</template>

<script lang="ts" setup>
import { computed, defineProps } from "vue"

import CollapseTransition from "@ivanv/vue-collapse-transition"

import type { Patch } from "../types"

import Answer from "./answer.vue"
import Links from "./links.vue"
import Question from "./question.vue"

const props = defineProps<{
  last?: Patch
  relevantPatches: Patch[]
  recentlyReleased: boolean
}>()

const links = computed(() => props.last?.links ?? null)
</script>

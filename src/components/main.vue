<template>
  <section class="flex flex-shrink flex-col items-center">
    <AutoplayAlert v-if="!canPlayAudio" />

    <Question :relevant-patches="relevantPatches" />

    <Answer :released="recentlyReleased" />

    <CollapseTransition :duration="500">
      <div v-if="!recentlyReleased" class="text-center">
        No need to refresh the page.
        <br />
        It will update as soon as we see a new update!
      </div>
    </CollapseTransition>

    <Celebration
      :recently-released="recentlyReleased"
      :initial-released-value="initialReleasedValue"
    />

    <Links v-if="recentlyReleased && links" :links="links" />
  </section>
</template>

<script lang="ts" setup>
import { computed } from "vue"

import CollapseTransition from "@ivanv/vue-collapse-transition"

import { canPlayAudio } from "../hooks/volume"
import type { Patch } from "../types"

import Answer from "./answer.vue"
import AutoplayAlert from "./autoplay-alert.vue"
import Celebration from "./celebration.vue"
import Links from "./links.vue"
import Question from "./question.vue"

const props = defineProps<{
  last: Patch | null
  relevantPatches: Patch[]
  recentlyReleased: boolean
  initialReleasedValue: boolean | null
}>()

const links = computed(() => props.last?.links ?? null)
</script>

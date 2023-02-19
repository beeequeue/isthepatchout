<template>
  <section class="flex flex-shrink flex-col items-center">
    <Question
      v-if="state.latestPatch != null"
      :recently-released="state.recentlyReleased"
      :latest-patch="state.latestPatch"
    />

    <Answer :released="state.recentlyReleased" />

    <CollapseTransition :duration="500">
      <div v-if="!state.recentlyReleased" class="text-center">
        No need to refresh the page.
        <br />
        It will update as soon as we see a new update!
      </div>
    </CollapseTransition>

    <Celebration />

    <Links v-if="state.recentlyReleased && links" :links="links" />
  </section>
</template>

<script lang="ts" setup>
import { computed } from "vue"

import CollapseTransition from "@ivanv/vue-collapse-transition"

import { state } from "@/state"

import Answer from "./answer.vue"
import Celebration from "./celebration.vue"
import Links from "./links.vue"
import Question from "./question.vue"

const links = computed(() => state.latestPatch?.links ?? null)
</script>

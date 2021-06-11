<template>
  <section class="flex flex-col items-center">
    <Question :relevant-patches="relevantPatches" />

    <Answer :released="recentlyReleased" />

    <CollapseTransition :duration="500">
      <div v-if="!recentlyReleased" class="visible">Checking for updates...</div>
    </CollapseTransition>

    <ul v-if="recentlyReleased" class="links">
      <li v-for="link in links" :key="link">
        <a :href="link" target="_blank" rel="noopener">{{ link }}</a>
      </li>
    </ul>
  </section>
</template>

<script lang="ts" setup>
import { computed, defineProps } from "vue"

import CollapseTransition from "@ivanv/vue-collapse-transition"

import type { Patch } from "../types"

import Answer from "./answer.vue"
import Question from "./question.vue"

const props = defineProps<{
  last?: Patch | null
  relevantPatches: Patch[]
  recentlyReleased: boolean
}>()

const links = computed(() => props.last?.links ?? null)
</script>

<style scoped>
.links {
  font-size: 1.25em;
}
</style>

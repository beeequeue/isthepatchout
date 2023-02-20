import { reactive } from "vue"

import { isRecentlyReleased } from "~/utils/patch"

import type { Patch } from "./types"

export const state = reactive({
  loading: true,
  latestPatch: null as Patch | null,
  recentlyReleased: false,
  releasedBeforeOpen: false,
})

export const mutations = {
  updateInitialData: (latestPatch: Patch) => {
    state.loading = false

    state.latestPatch = latestPatch

    state.recentlyReleased = isRecentlyReleased(latestPatch)
    state.releasedBeforeOpen = true
  },

  releaseNewPatch: (newPatch: Patch) => {
    state.latestPatch = newPatch

    state.recentlyReleased = isRecentlyReleased(newPatch)
    state.releasedBeforeOpen = false
  },
}

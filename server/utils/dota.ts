import type { FetchError } from "ofetch"
import PQueue from "p-queue"
import { isError } from "remeda"

import { Logger } from "./logger"

const dotaApiScheduler = new PQueue({
  concurrency: 3,
  interval: 1000,
  intervalCap: 1,
})

export type PatchNoteListItem = {
  patch_number: string
  patch_name: string
  patch_timestamp: number
  patch_website?: string
  patch_anchor?: string
}

export type PatchNoteListData = {
  patches: PatchNoteListItem[]
  success: boolean
}

const request = () =>
  $fetch<PatchNoteListData>("https://www.dota2.com/datafeed/patchnoteslist", {
    responseType: "json",
    headers: { Host: "www.dota2.com" },
    retry: 3,
  }).catch((error: FetchError) => error)

export const getPatchList = async () => {
  Logger.info("Fetching patch list...")

  const response = await dotaApiScheduler.add(request, { throwOnTimeout: true })

  if (isError(response)) {
    Logger.error("Request failed", response.response)
    return null
  }

  Logger.debug(response?.patches?.slice(-5))

  return response.patches
}

import Bottleneck from "bottleneck"
import { $fetch } from "ohmyfetch"
import type { FetchError } from "ohmyfetch"
import { isError } from "remeda"

import { Logger } from "./_logger"

const dotaApiScheduler = new Bottleneck({
  minTime: 1000,
  maxConcurrent: 3,
})

/* eslint-disable @typescript-eslint/naming-convention */
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
/* eslint-enable @typescript-eslint/naming-convention */

const request = () =>
  $fetch<PatchNoteListData>("https://www.dota2.com/datafeed/patchnoteslist", {
    responseType: "json",
    headers: { Host: "www.dota2.com" },
    retry: 3,
  }).catch((error: FetchError) => error)

export const getPatchList = async () => {
  Logger.info("Fetching patch list...")

  const response = await dotaApiScheduler.schedule(request)

  if (isError(response)) {
    Logger.error("Request failed", response.response)
    return null
  }

  Logger.debug(response?.patches?.slice(-5))

  return response.patches
}

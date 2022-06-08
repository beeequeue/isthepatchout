import Bottleneck from "bottleneck"
import HttpClient from "got"

import { Logger } from "./_logger"

const dotaApiScheduler = new Bottleneck({
  minTime: 1000,
  maxConcurrent: 3,
})

const http = HttpClient.extend({
  prefixUrl: "https://www.dota2.com/datafeed",
  retry: 3,
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
}
/* eslint-enable @typescript-eslint/naming-convention */

const request = () =>
  http.get<PatchNoteListData>("patchnoteslist", {
    headers: { Host: "www.dota2.com" },
    responseType: "json",
    retry: 3,
  })

export const getPatchList = async () => {
  Logger.info("Fetching patch list...")

  const response = await dotaApiScheduler.schedule(request)

  if (response.statusCode >= 400) {
    Logger.error("Request failed", {
      status: response.statusCode,
      body: response.body,
    })
    return null
  }

  Logger.debug(response.body?.patches?.slice(-5))

  return response.body.patches
}

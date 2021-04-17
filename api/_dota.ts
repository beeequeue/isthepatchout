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

export const getPatchList = async () => {
  Logger.info("Fetching patch list...")

  const request = () =>
    http.get<PatchNoteListData>("patchnoteslist", {
      headers: { Host: "www.dota2.com" },
      responseType: "json",
      retry: 3,
    })

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

type PatchType = "major" | "minor" | "patch"

export class DotaVersion {
  #regex = /^(\d)\.(\d{1,2})([a-z])?$/

  major: number
  minor: number
  patch: number
  type: PatchType

  constructor(input: string) {
    const matches = this.#regex.exec(input)

    if (matches == null) throw new Error(`Got invalid DotaVersion (${input}).`)

    this.major = Number(matches[1])
    this.minor = Number(matches[2])
    this.patch = matches[3] != null ? matches[3].charCodeAt(0) - 97 + 1 : 0

    this.type = this.patch === 0 ? (this.minor === 0 ? "major" : "minor") : "patch"
  }

  increment(type: PatchType) {
    switch (type) {
      case "major":
        this.major++
        break
      case "minor":
        this.minor++
        break
      case "patch":
        this.patch++
        break
    }
  }

  toNumber() {
    return this.major * 10000 + this.minor * 100 + this.patch
  }

  toString() {
    let minorPart = this.minor.toString()
    if (this.minor < 10) {
      minorPart = minorPart.padStart(2, "0")
    }

    const patchPart = this.patch !== 0 ? String.fromCharCode(this.patch + 97 - 1) : ""

    return `${this.major}.${minorPart}${patchPart}`
  }
}

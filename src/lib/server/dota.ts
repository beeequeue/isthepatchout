import { createLimiter } from "alleviate"
import { DotaVersion } from "dotaver"
import { log } from "evlog"
import xior from "xior"
import retry from "xior/plugins/error-retry"

import type { Patch } from "#/types.ts"

type PatchNoteListItem = {
  patch_number: string
  patch_name: string
  patch_timestamp: number
  patch_website?: string
  patch_anchor?: string
}

type PatchNoteListData = {
  patches?: PatchNoteListItem[]
  success: boolean
}

export function formatPatchData(data: PatchNoteListItem): Patch {
  let links = [`https://dota2.com/patches/${data.patch_number}`]

  if (data.patch_website != null) {
    links = [`https://dota2.com/${data.patch_website}`, ...links]
  }

  return {
    id: data.patch_number,
    number: DotaVersion.parse(data.patch_number).toNumber(),
    releasedAt: new Date(data.patch_timestamp * 1000).toISOString(),
    links,
  }
}

const dotaApiScheduler = createLimiter({
  concurrency: 1,
  pool: 3,
  initial: 1,
  refill: 1,
  refillInterval: 1000,
})

const client = xior.create({
  baseURL: "https://www.dota2.com",
  responseType: "json",
  headers: { Host: "www.dota2.com" },
})
client.plugins.use(retry({ retryInterval: 1000 }))

let failures = 0
export const getPatchList = async (): Promise<Patch[] | null> => {
  log.debug("dota", "Fetching patch list...")

  const response = await dotaApiScheduler.run(async () =>
    client.get<PatchNoteListData>("/datafeed/patchnoteslist"),
  )

  if (response instanceof Error) {
    log.error({ action: "dota", message: "Request failed", error: response })
    return null
  }

  log.debug({
    action: "dota",
    patches: response?.data?.patches?.slice(-5)?.map((p) => p.patch_name),
  })

  if (response.data.patches == null) {
    failures++
    if (failures > 10) {
      throw new Error(`No patches returned from dota2.com:\n${JSON.stringify(response.data)}`)
    }

    return null
  }

  return response.data.patches.map(formatPatchData)
}

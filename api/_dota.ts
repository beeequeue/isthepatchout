import Bottleneck from "bottleneck"
import HttpClient from "got"

const dotaApiScheduler = new Bottleneck({
  minTime: 1000,
  maxConcurrent: 3,
})

const http = HttpClient.extend({
  prefixUrl: "https://www.dota2.com/datafeed",
  retry: 3,
})

export type PatchData = {
  /* eslint-disable @typescript-eslint/naming-convention */
  success: true
  patch_number: string
  patch_name: string
  patch_timestamp: number
  patch_website?: string
  patch_anchor?: string
  generic: unknown[]
  items: unknown[]
  neutral_items: unknown[]
  heroes: unknown[]
  /* eslint-enable @typescript-eslint/naming-convention */
}

type PatchDataError = {
  success: false
  message: string
}

export const getPatchData = async (version: string) => {
  const request = () =>
    http.get<PatchData | PatchDataError>("/patchnotes", {
      headers: { Host: "www.dota2.com" },
      searchParams: {
        language: "english",
        version,
      },
      retry: 3,
    })

  const response = await dotaApiScheduler.schedule(request)

  if (response.statusCode >= 400) {
    console.error(response.statusCode, response.body)
    return
  }

  if (!response.body.success) {
    console.error(response.body.message)
    return
  }

  return response.body
}

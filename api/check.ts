import { URLSearchParams } from "url"

import Bottleneck from "bottleneck"
import fetch from "make-fetch-happen"

import { SupabaseClient } from "@supabase/supabase-js"
import type { VercelRequest, VercelResponse } from "@vercel/node"

import type { Patch } from "../src/types"

const { CHECK_TOKEN, SUPABASE_SERVICE_KEY, VITE_SUPABASE_URL } = process.env

const supabase = new SupabaseClient(
  VITE_SUPABASE_URL as string,
  SUPABASE_SERVICE_KEY as string,
)

const dotaApiScheduler = new Bottleneck({
  minTime: 1000,
  maxConcurrent: 3,
})

const getPatchesToCheck = async (): Promise<Patch[] | null> => {
  const response = await supabase.from<Patch>("patches").select().eq("released", false)

  if (response.error != null) {
    console.error(response.error)
    return null
  }

  return response.data
}

const checkAndUpdatePatch = async (patch: Patch) => {
  const params = new URLSearchParams({
    language: "english",
    version: patch.id,
  })
  const dataResponse = await fetch(
    `https://www.dota2.com/datafeed/patchnotes?${params.toString()}`,
    {
      headers: { Host: "www.dota2.com" },
    },
  )

  if (!dataResponse.ok) {
    console.error(dataResponse.headers, await dataResponse.text())
    return
  }

  const data = await dataResponse.json()

  if (data?.patch_timestamp == null) return

  const updateResponse = await supabase
    .from<Patch>("patches")
    .update({ released: true })
    .eq("id", patch.id)

  if (updateResponse.error != null) {
    console.error(updateResponse.error)
  }
}

const checkAndUpdatePatches = async () => {
  const patches = await getPatchesToCheck()

  if (patches == null) {
    throw new Error("Could not get patches")
  }

  await Promise.all(
    patches.map((patch) => dotaApiScheduler.schedule(() => checkAndUpdatePatch(patch))),
  )
}

export default async (_request: VercelRequest, response: VercelResponse) => {
  if (CHECK_TOKEN == null || _request.headers.authorization !== `Bearer ${CHECK_TOKEN}`) {
    return response.status(403).json({ ok: false, message: "Forbidden" })
  }

  try {
    await checkAndUpdatePatches()
  } catch (err) {
    return response.status(500).json({ ok: false, message: err.message })
  }

  response.status(200).json({ ok: true })
}

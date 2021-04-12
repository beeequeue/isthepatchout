import { URLSearchParams } from "url"

import Bottleneck from "bottleneck"
import fetch from "make-fetch-happen"

import type { VercelRequest, VercelResponse } from "@vercel/node"

import type { Patch } from "../src/types"

const { CHECK_TOKEN, SUPABASE_SERVICE_KEY, VITE_SUPABASE_URL } = process.env

const dotaApiScheduler = new Bottleneck({
  minTime: 1000,
  maxConcurrent: 3,
})

const authParam = new URLSearchParams({
  apikey: SUPABASE_SERVICE_KEY as string,
})

const getPatchesToCheck = async (): Promise<Patch[] | null> => {
  try {
    const response = await fetch(
      `${
        VITE_SUPABASE_URL as string
      }/rest/v1/patches?released=eq.false&${authParam.toString()}`,
    )
    const body = await response.json()

    if (!response.ok) {
      console.error(body)
      return null
    }

    return body
  } catch (err) {
    console.error(err)
    return null
  }
}

const checkAndUpdatePatch = async (patch: string) => {
  const params = new URLSearchParams({
    language: "english",
    version: patch,
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

  const updateResponse = await fetch(
    `${
      VITE_SUPABASE_URL as string
    }/rest/v1/patches?id=eq.${patch}&${authParam.toString()}`,
    {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ released: true }),
    },
  )

  if (!updateResponse.ok) {
    console.error(await updateResponse.text())
  }
}

const checkAndUpdatePatches = async () => {
  const patches = await getPatchesToCheck()

  if (patches == null) {
    throw new Error("Could not get patches")
  }

  await Promise.all(
    patches.map((patch) =>
      dotaApiScheduler.schedule(() => checkAndUpdatePatch(patch.id)),
    ),
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

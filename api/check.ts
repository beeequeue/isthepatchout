import { URLSearchParams } from "url"

import fetch from "make-fetch-happen"

import type { VercelRequest, VercelResponse } from "@vercel/node"

import type { Patch } from "../src/types"

const authParam = new URLSearchParams({
  apikey: process.env.SUPABASE_SERVICE_KEY as string,
})

const getPatchesToCheck = async (): Promise<Patch[] | null> => {
  try {
    const response = await fetch(
      `${
        process.env.VITE_SUPABASE_URL as string
      }/rest/v1/patches?released=eq.false&${authParam.toString()}`,
    )
    const body = await response.json()

    return response.ok ? body : null
  } catch {
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

  console.log(data)
  if (data?.patch_timestamp == null) return

  const updateResponse = await fetch(
    `${
      process.env.VITE_SUPABASE_URL as string
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

export default async (_request: VercelRequest, response: VercelResponse) => {
  const patches = await getPatchesToCheck()

  if (patches == null) {
    return
  }

  await Promise.all(patches.map((patch) => checkAndUpdatePatch(patch.id)))

  response.status(200).json({ ok: true })
}

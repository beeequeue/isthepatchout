import type { VercelRequest, VercelResponse } from "@vercel/node"

import type { Patch } from "../src/types"

import { getPatchData } from "./_dota"
import { getPatchesToCheck, updatePatchData } from "./_supabase"

const { CHECK_TOKEN } = process.env

const checkAndUpdatePatch = async (patch: Patch) => {
  const data = await getPatchData(patch.id)

  if (data?.patch_timestamp == null) return

  await updatePatchData(patch, data)
}

const checkAndUpdatePatches = async () => {
  const patches = await getPatchesToCheck()

  if (patches == null) {
    throw new Error("Could not get patches")
  }

  await Promise.all(patches.map((patch) => checkAndUpdatePatch(patch)))
}

/**
 * GET /api/check
 * When an authenticated request comes through we get the two possible
 * upcoming patches (letter and minor) and check if they are out.
 *
 * If a new patch is released, we update it with `released: true`, new links,
 * and add new patches to check in the future.
 */
export default async (request: VercelRequest, response: VercelResponse) => {
  if (CHECK_TOKEN == null || request.headers.authorization !== `Bearer ${CHECK_TOKEN}`) {
    return response.status(403).json({ ok: false, message: "Forbidden" })
  }

  try {
    await checkAndUpdatePatches()
  } catch (err) {
    return response.status(500).json({ ok: false, message: err.message })
  }

  response.status(200).json({ ok: true })
}

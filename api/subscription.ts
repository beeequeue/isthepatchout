import { URL } from "url"

import type { VercelRequest, VercelResponse } from "@vercel/node"

import type { PushSubscription } from "../src/types"

import { upsertSubscription } from "./_supabase"

const {} = process.env

const isUrl = (str: string) => {
  if (str.includes(" ")) {
    return false
  }

  try {
    new URL(str)
    return true
  } catch {
    return false
  }
}

const notFoundBody = `
The page could not be found

NOT_FOUND
`.trim()

const respondNotFound = (response: VercelResponse) => {
  response.status(404)
  response.setHeader("content-type", "text/plain")
  response.send(notFoundBody)
}

const respondBadRequest = (response: VercelResponse) => {
  response.status(400)
  response.json({ ok: false, message: "Invalid body" })
}

/**
 * POST /api/subscription
 *
 */
export default async (request: VercelRequest, response: VercelResponse) => {
  if (request.method !== "POST") {
    return respondNotFound(response)
  }

  let { id, pushEndpoint } = (request.body ?? {}) as Partial<PushSubscription>

  if (id == null || pushEndpoint == null) {
    return respondBadRequest(response)
  }

  id = id.trim()
  pushEndpoint = pushEndpoint.trim()

  if (id.length !== 15 || !isUrl(pushEndpoint)) {
    return respondBadRequest(response)
  }

  await upsertSubscription(id, pushEndpoint)

  response.status(200).json({ ok: true })
}

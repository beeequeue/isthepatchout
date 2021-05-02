import Joi from "joi"

import type { VercelRequest, VercelResponse } from "@vercel/node"

import {
  deleteSubscription,
  doesSubscriptionExist,
  upsertSubscription,
} from "./_supabase"

type Handler = (request: VercelRequest, response: VercelResponse) => Promise<void> | void

const { VERCEL_ENV } = process.env

export type UpdateSubscriptionInput = {
  endpoint: string
  keys: {
    auth: string
    p256dh: string
  }
}

const schema = Joi.object<UpdateSubscriptionInput>({
  endpoint: Joi.string().uri({ scheme: ["https"] }),
  keys: Joi.object({
    auth: Joi.string().min(10).trim(),
    p256dh: Joi.string().min(10),
  }),
})

const notFoundBody = `
The page could not be found

NOT_FOUND
`.trim()

const getCorsOrigin = (request: VercelRequest) => {
  if (request.headers.origin) return request.headers.origin

  if (request.headers["x-forwarded-host"]) {
    const proto = request.headers["x-forwarded-proto"] as string
    const host = request.headers["x-forwarded-host"] as string
    return `${proto}://${host}`
  }

  return request.headers.host as string
}

const cors = (fn: Handler): Handler => (request, response) => {
  response.setHeader(
    "Access-Control-Allow-Origin",
    VERCEL_ENV === "production" ? "https://isthepatchout.com" : getCorsOrigin(request),
  )

  response.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE")
  response.setHeader(
    "Access-Control-Allow-Headers",
    "Accept, Accept-Version, Content-Length, Content-Type, Date",
  )

  if (request.method === "OPTIONS") {
    response.status(200).end()
    return
  }

  return fn(request, response)
}

const respondNotFound = (response: VercelResponse) => {
  response.status(404)
  response.setHeader("content-type", "text/plain")
  response.send(notFoundBody)
}

const respondBadRequest = (response: VercelResponse, message = "Invalid body") => {
  response.status(400)
  response.json({ ok: false, message })
}

const getHandler = async (request: VercelRequest, response: VercelResponse) => {
  if (request.query.endpoint == null || typeof request.query.endpoint !== "string") {
    return respondBadRequest(response, "Invalid query parameters")
  }

  const exists = await doesSubscriptionExist(request.query.endpoint)

  response.status(200).json({ ok: true, exists })
}

const postHandler = async (request: VercelRequest, response: VercelResponse) => {
  if (request.headers["content-type"] !== "application/json") {
    return respondBadRequest(response, "Body isn't JSON")
  }

  const { error, value } = schema.validate(request.body, {
    abortEarly: false,
    stripUnknown: true,
    presence: "required",
  })

  if (error != null) {
    return respondBadRequest(response, error.message)
  }

  await upsertSubscription(value)

  response.status(200).json({ ok: true })
}

const deleteHandler = async (request: VercelRequest, response: VercelResponse) => {
  if (request.query.endpoint == null || typeof request.query.endpoint !== "string") {
    return respondBadRequest(response, "Invalid query parameters")
  }

  await deleteSubscription(request.query.endpoint)

  response.status(200).json({ ok: true })
}

/**
 * GET/POST /api/subscription
 *
 */
const handler = async (request: VercelRequest, response: VercelResponse) => {
  if (request.method === "GET") {
    return getHandler(request, response)
  }

  if (request.method === "POST") {
    return postHandler(request, response)
  }

  if (request.method === "DELETE") {
    return deleteHandler(request, response)
  }

  return respondNotFound(response)
}

export default cors(handler)

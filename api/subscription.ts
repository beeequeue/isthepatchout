import Joi from "joi"

import { badRequest, notFound } from "@hapi/boom"
import type { VercelRequest, VercelResponse } from "@vercel/node"

import { CustomHandler, sentryWrapper } from "./_sentry"
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

const getCorsOrigin = (request: VercelRequest) => {
  if (request.headers.origin) return request.headers.origin

  if (request.headers["x-forwarded-host"]) {
    const proto = request.headers["x-forwarded-proto"] as string
    const host = request.headers["x-forwarded-host"] as string
    return `${proto}://${host}`
  }

  return request.headers.host as string
}

const cors =
  (fn: Handler): Handler =>
  (request, response) => {
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

const getHandler: CustomHandler = async (request) => {
  if (request.query.endpoint == null || typeof request.query.endpoint !== "string") {
    return badRequest("Invalid query parameters")
  }

  const exists = await doesSubscriptionExist(request.query.endpoint)

  return { exists }
}

const postHandler: CustomHandler = async (request) => {
  if (request.headers["content-type"] !== "application/json") {
    return badRequest("Body isn't JSON")
  }

  const { error, value } = schema.validate(request.body, {
    abortEarly: false,
    stripUnknown: true,
    presence: "required",
  })

  if (error != null) {
    return badRequest(error.message)
  }

  await upsertSubscription(value)
}

const deleteHandler: CustomHandler = async (request) => {
  if (request.query.endpoint == null || typeof request.query.endpoint !== "string") {
    return badRequest("Invalid query parameters")
  }

  await deleteSubscription(request.query.endpoint)
}

/**
 * GET/POST /api/subscription
 *
 */
const handler: CustomHandler = async (request) => {
  if (request.method === "GET") {
    return getHandler(request)
  }

  if (request.method === "POST") {
    return postHandler(request)
  }

  if (request.method === "DELETE") {
    return deleteHandler(request)
  }

  return notFound()
}

export default cors(sentryWrapper("/subscription", handler))

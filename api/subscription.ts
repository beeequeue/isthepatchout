import z, { Infer } from "myzod"

import { badRequest, notFound } from "@hapi/boom"
import type { VercelRequest, VercelResponse } from "@vercel/node"

import { Logger } from "./_logger"
import { CustomHandler, sentryWrapper } from "./_sentry"
import {
  deleteSubscription,
  doesSubscriptionExist,
  upsertSubscription,
} from "./_supabase"

type Handler = (request: VercelRequest, response: VercelResponse) => Promise<void> | void

const { VERCEL_ENV } = process.env

const Input = z.object(
  {
    endpoint: z.string().pattern(/^https:\/\//),
    keys: z.object({
      auth: z.string().min(10),
      p256dh: z.string().min(10),
    }),
  },
  { allowUnknown: false },
)

export type UpdateSubscriptionInput = Infer<typeof Input>

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
  Logger.info("test")

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

  const result = Input.try(request.body)
  if (result instanceof z.ValidationError) {
    return badRequest(result.message)
  }

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  await upsertSubscription(result)
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

import { defineEventHandler, readBody, setResponseStatus } from "h3"
import * as v from "valibot"

import { serverSupabase } from "~/server/composables/supabase"
import { okResponse } from "~/server/utils"

const InputSchema = v.strictObject({
  endpoint: v.pipe(v.string(), v.regex(/^https:\/\//)),
  keys: v.strictObject({
    auth: v.pipe(v.string(), v.minLength(10)),
    p256dh: v.pipe(v.string(), v.minLength(10)),
  }),
  expirationTime: v.nullable(v.number()),
})

export type UpdateSubscriptionInput = v.InferOutput<typeof InputSchema>

export default defineEventHandler(async (event) => {
  const contentType = getHeader(event, "content-type")
  if (contentType !== "application/json") {
    throw createError({ statusCode: 400, statusMessage: "Body isn't JSON" })
  }

  const body = await readBody<never>(event)
  const result = v.safeParse(InputSchema, body)
  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: "Bad request",
      data: Object.fromEntries(
        result.issues.map((issue) => [issue.path?.join("."), issue.message]),
      ),
    })
  }

  const { upsertSubscription } = serverSupabase(event)

  await upsertSubscription(result.output)

  setResponseStatus(event, 201)

  return okResponse
})

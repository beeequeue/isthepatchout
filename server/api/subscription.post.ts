import { defineEventHandler, readBody, setResponseStatus } from "h3"
import z, { Infer } from "myzod"
import { serverSupabase } from "~/server/composables/supabase"
import { okResponse } from "~/server/utils"

const Input = z.object(
  {
    endpoint: z.string().pattern(/^https:\/\//),
    keys: z.object({
      auth: z.string().min(10),
      p256dh: z.string().min(10),
    }),
    expirationTime: z.number().nullable(),
  },
  { allowUnknown: false },
)

export type UpdateSubscriptionInput = Infer<typeof Input>

export default defineEventHandler(async (event) => {
  const contentType = getHeader(event, "content-type")
  if (contentType !== "application/json") {
    throw createError({ statusCode: 400, statusMessage: "Body isn't JSON" })
  }

  const body = await readBody<unknown>(event)
  const result = Input.try(body)
  if (result instanceof z.ValidationError) {
    throw createError({
      statusCode: 400,
      statusMessage: result.message,
      data: result.collectedErrors,
      cause: result,
    })
  }

  const { upsertSubscription } = serverSupabase(event)

  await upsertSubscription(result)

  setResponseStatus(event, 201)

  return okResponse
})

import { defineEventHandler, readBody } from "h3"
import z, { Infer } from "myzod"

import { serverSupabase } from "~/server/composables/supabase"

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

export default defineEventHandler(async (event) => {
  const contentType = getHeader(event, "content-type")
  if (contentType !== "application/json") {
    throw createError({ statusCode: 400, message: "Body isn't JSON" })
  }

  const body = await readBody<unknown>(event)
  const result = Input.try(body)
  if (result instanceof z.ValidationError) {
    throw createError({ statusCode: 400, message: result.message })
  }

  const { upsertSubscription } = serverSupabase(event)

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
  await upsertSubscription(result)
})

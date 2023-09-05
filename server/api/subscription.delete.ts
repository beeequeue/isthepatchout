import { defineEventHandler } from "h3"
import { serverSupabase } from "~/server/composables/supabase"
import { okResponse } from "~/server/utils"

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { endpoint } = query

  if (endpoint == null || typeof endpoint !== "string") {
    throw createError({ statusCode: 400, message: "Invalid query parameters" })
  }

  const { deleteSubscription } = serverSupabase(event)

  await deleteSubscription(endpoint)

  return okResponse
})

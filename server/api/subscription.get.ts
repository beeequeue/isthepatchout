import { defineEventHandler } from "h3"

import { serverSupabase } from "~/server/composables/supabase"

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { endpoint } = query

  if (endpoint == null || typeof endpoint !== "string") {
    throw createError({ statusCode: 400, message: "Invalid query parameters" })
  }

  const { doesSubscriptionExist } = serverSupabase(event)

  const exists = await doesSubscriptionExist(endpoint)
  return { exists }
})

import { forbidden } from "@hapi/boom"

import type { Patch } from "../src/types"

import { sendNotification } from "./_push"
import { CustomHandler, sentryWrapper } from "./_sentry"
import { supabase } from "./_supabase"

const { CHECK_TOKEN, VERCEL_ENV } = process.env

const handler: CustomHandler = async (request) => {
  if (
    VERCEL_ENV === "production" ||
    CHECK_TOKEN == null ||
    request.headers.authorization !== `Bearer ${CHECK_TOKEN}`
  ) {
    return forbidden()
  }

  const { data } = await supabase
    .from<Patch>("patches")
    .select()
    .order("releasedAt", { ascending: false })
    .limit(1)
    .single()

  await sendNotification(data!)
}

export default sentryWrapper("/send-notification", handler)

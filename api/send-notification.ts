import type { VercelRequest, VercelResponse } from "@vercel/node"

import type { Patch } from "../src/types"

import { sendNotification } from "./_push"
import { sentryWrapper } from "./_sentry"
import { supabase } from "./_supabase"

const { CHECK_TOKEN, VERCEL_ENV } = process.env

const handler = async (request: VercelRequest, response: VercelResponse) => {
  if (
    VERCEL_ENV === "production" ||
    CHECK_TOKEN == null ||
    request.headers.authorization !== `Bearer ${CHECK_TOKEN}`
  ) {
    response.status(403).json({ ok: false, message: "Forbidden" })

    return
  }

  const { data } = await supabase
    .from<Patch>("patches")
    .select()
    .order("releasedAt", { ascending: false })
    .limit(1)
    .single()

  await sendNotification(data!)

  response.status(200).json({ ok: true })
}

export default sentryWrapper("/send-notification", handler)

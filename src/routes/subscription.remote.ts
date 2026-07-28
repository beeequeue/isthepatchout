import * as v from "valibot"

import { $subscription } from "#lib/server/db/queries.ts"
import { command } from "$app/server"

const endpointSchema = v.pipe(v.string(), v.url(), v.maxLength(500))

const schema = v.object({
  endpoint: endpointSchema,
  keys: v.object({
    auth: v.pipe(v.string(), v.maxLength(100)),
    p256dh: v.pipe(v.string(), v.maxLength(100)),
  }),
})

export const subscribe = command(schema, async (incoming): Promise<boolean> => {
  $subscription.upsert.run(
    "push",
    incoming.endpoint,
    incoming.keys.auth,
    incoming.keys.p256dh,
    process.env.NODE_ENV ?? "development",
    Temporal.Now.instant().toString(),
  )
  return true
})

export const unsubscribe = command(endpointSchema, async (endpoint): Promise<boolean> => {
  $subscription.delete.run(endpoint)
  return true
})

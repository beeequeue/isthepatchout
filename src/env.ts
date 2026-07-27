import { defineEnvVars } from "@sveltejs/kit/env"
import * as v from "valibot"

import { building } from "$app/env"

const vapidPublicKeySchema = v.pipe(
  v.string(),
  v.transform((data) => Uint8Array.fromBase64(data, { alphabet: "base64url" })),
  v.check((buffer) => buffer.byteLength === 65, "Public key is not 65 bytes long."),
)

const vapidPrivateKeySchema = v.pipe(
  v.string(),
  v.transform((data) => Uint8Array.fromBase64(data, { alphabet: "base64url" })),
  v.check((buffer) => buffer.byteLength === 32, "Private key is not 32 bytes long."),
)

export const variables = defineEnvVars({
  DISCORD_CLIENT_ID: {
    schema: !building ? v.string() : v.optional(v.string()),
  },
  DISCORD_CLIENT_SECRET: {
    schema: !building ? v.string() : v.optional(v.string()),
  },

  VAPID_PUBLIC_KEY: {
    public: true,
    schema: !building ? vapidPublicKeySchema : v.optional(vapidPublicKeySchema),
  },
  VAPID_PRIVATE_KEY: {
    schema: !building ? vapidPrivateKeySchema : v.optional(vapidPrivateKeySchema),
  },
})

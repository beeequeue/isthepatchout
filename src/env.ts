import { defineEnvVars } from "@sveltejs/kit/env"
import * as v from "valibot"

import { building } from "$app/env"

const vapidPublicKeySchema = v.optional(
  v.pipe(
    v.string(),
    v.transform((data) => Uint8Array.fromBase64(data, { alphabet: "base64url" })),
    v.check((buffer) => buffer.byteLength === 65, "Public key is not 65 bytes long."),
  ),
)

const vapidPrivateKeySchema = v.optional(
  v.pipe(
    v.string(),
    v.transform((data) => Uint8Array.fromBase64(data, { alphabet: "base64url" })),
    v.check((buffer) => buffer.byteLength === 32, "Private key is not 32 bytes long."),
  ),
)

export const variables = defineEnvVars({
  DISCORD_CLIENT_ID: {
    schema: v.optional(v.string()),
  },
  DISCORD_CLIENT_SECRET: {
    schema: v.optional(v.string()),
  },

  VAPID_PUBLIC_KEY: {
    public: true,
    schema: !building ? vapidPublicKeySchema : undefined,
  },
  VAPID_PRIVATE_KEY: {
    schema: !building ? vapidPrivateKeySchema : undefined,
  },
})

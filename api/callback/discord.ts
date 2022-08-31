/* eslint-disable @typescript-eslint/naming-convention */
import z from "myzod"
import { $fetch } from "ohmyfetch"

import { badRequest } from "@hapi/boom"

import { Logger } from "../_logger"
import { CustomHandler, sentryWrapper } from "../_sentry"
import { registerDiscordWebhook } from "../_supabase"

const { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, VITE_API_URL } = process.env as Record<
  string,
  string
>

const Input = z.object(
  {
    code: z.string(),
    guild_id: z.string(),
  },
  { allowUnknown: false },
)

/**
 * GET /api/callback/discord
 * Registers a new Discord webhook for the notifications service to call when a new patch is released
 */
const handler: CustomHandler = async (request) => {
  const result = Input.try(request.query)
  if (result instanceof z.ValidationError) {
    return badRequest(result.message)
  }

  const response = await $fetch<{ webhook: { id: string; url: string } }>(
    "https://discord.com/api/v9/oauth2/token",
    {
      responseType: "json",
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: DISCORD_CLIENT_ID,
        client_secret: DISCORD_CLIENT_SECRET,
        code: result.code,
        redirect_uri: `${VITE_API_URL}/api/callback/discord`,
      }),
    },
  )

  try {
    await registerDiscordWebhook(
      response.webhook.url,
      result.guild_id,
      response.webhook.id,
    )

    return {
      statusCode: 302,
      headers: {
        Location: `${VITE_API_URL}?discord=true`,
      },
    }
  } catch (error: unknown) {
    Logger.error(error, "Failed to add Discord webhook")

    return {
      statusCode: 302,
      headers: {
        Location: `${VITE_API_URL}?discord=false`,
      },
    }
  }
}

export default sentryWrapper("/check", handler)

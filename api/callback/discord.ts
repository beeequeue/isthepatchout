/* eslint-disable @typescript-eslint/naming-convention */
import HttpClient from "got"
import Joi from "joi"

import { badRequest } from "@hapi/boom"

import { Logger } from "../_logger"
import { CustomHandler, sentryWrapper } from "../_sentry"
import { registerDiscordWebhook } from "../_supabase"

const { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, VITE_API_URL } = process.env as Record<
  string,
  string
>

export type DiscordCallbackInput = {
  code: string
  guild_id: string
}

const schema = Joi.object<DiscordCallbackInput>({
  code: Joi.string(),
  guild_id: Joi.string(),
})

/**
 * GET /api/callback/discord
 * Registers a new Discord webhook for the notifications service to call when a new patch is released
 */
const handler: CustomHandler = async (request) => {
  const { error: validationError, value } = schema.validate(request.query, {
    abortEarly: false,
    stripUnknown: true,
    presence: "required",
  })

  if (validationError != null) {
    return badRequest(validationError.message)
  }

  const response = await HttpClient.post<{ webhook: { id: string; url: string } }>(
    "https://discord.com/api/v9/oauth2/token",
    {
      responseType: "json",
      form: {
        grant_type: "authorization_code",
        client_id: DISCORD_CLIENT_ID,
        client_secret: DISCORD_CLIENT_SECRET,
        code: value!.code,
        redirect_uri: `${VITE_API_URL}/api/callback/discord`,
      },
    },
  )

  try {
    await registerDiscordWebhook(
      response.body.webhook.url,
      value!.guild_id,
      response.body.webhook.id,
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

import { defineEventHandler, sendRedirect } from "h3"
import z from "myzod"

import { serverSupabase } from "~/server/composables/supabase"

const Input = z.object(
  {
    code: z.string(),
    guild_id: z.string(),
  },
  { allowUnknown: false },
)

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)

  const result = Input.try(query)
  if (result instanceof z.ValidationError) {
    throw createError({ statusCode: 400, message: result.message })
  }

  const response = await $fetch<{ webhook: { id: string; url: string } }>(
    "https://discord.com/api/v9/oauth2/token",
    {
      responseType: "json",
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: config.discordClientId,
        client_secret: config.discordClientSecret,
        code: result.code,
        redirect_uri: `${config.public.apiUrl}/api/callback/discord`,
      }),
    },
  )

  try {
    const { registerDiscordWebhook } = serverSupabase(event)
    await registerDiscordWebhook(
      response.webhook.url,
      result.guild_id,
      response.webhook.id,
    )

    return sendRedirect(event, `${config.public.apiUrl}?discord=true`, 302)
  } catch (error: unknown) {
    Logger.error(error, "Failed to add Discord webhook")

    return sendRedirect(event, `${config.public.apiUrl}?discord=false`, 302)
  }
})

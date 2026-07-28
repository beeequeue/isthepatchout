import { error, redirect } from "@sveltejs/kit"
import * as v from "valibot"
import xior, { type XiorError } from "xior"

import { $subscription } from "#lib/server/db/queries.ts"
import { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET } from "$app/env/private"

import type { RequestHandler } from "./$types"

const queryParamSchema = v.object({
  code: v.string(),
  guild_id: v.pipe(
    v.string(),
    v.check((value) => !Number.isNaN(value), "invalid guild id"),
  ),
})

export const GET: RequestHandler = async ({ url }) => {
  const query = Object.fromEntries(url.searchParams.entries())
  const result = v.safeParse(queryParamSchema, query)
  if (!result.success) {
    error(400, result.issues[0].message)
  }

  try {
    const body = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: DISCORD_CLIENT_ID!,
      client_secret: DISCORD_CLIENT_SECRET!,
      code: result.output.code,
      redirect_uri: `${url.protocol}//${url.host}/callback/discord`,
    })

    const response = await xior.post<{ webhook: { id: string; url: string } }>(
      "https://discord.com/api/v9/oauth2/token",
      body,
      {
        responseType: "json",
        headers: { "content-type": "application/x-www-form-urlencoded" },
      },
    )

    $subscription.upsert.run(
      "discord",
      response.data.webhook.url,
      result.output.guild_id,
      response.data.webhook.id,
      import.meta.env.MODE,
      Temporal.Now.instant().toString(),
    )

    redirect(303, "/")
  } catch (e) {
    if (!(e instanceof Error)) throw e

    // eslint-disable-next-line ts/no-unsafe-member-access
    redirect(303, `/?error='${(e as XiorError)?.response?.data?.error_description}'`)
  }
}

import { Boom, internal, isBoom } from "@hapi/boom"
import {
  captureException,
  flush,
  init,
  Integrations,
  setContext,
  setTag,
  startTransaction,
} from "@sentry/node"
import type { Transaction } from "@sentry/types"
import type { VercelRequest, VercelResponse } from "@vercel/node"

import { Logger } from "./_logger"

type Handler = (request: VercelRequest, response: VercelResponse) => Promise<void> | void
type CustomResponse = Record<string, unknown> & { message?: string; statusCode?: number }
type CustomHandlerResponse = undefined | CustomResponse | Boom<null>
export type CustomHandler = (
  request: VercelRequest,
) => Promise<CustomHandlerResponse> | CustomHandlerResponse

init({
  enabled: process.env.VERCEL_ENV !== "development" && !!process.env.SENTRY_DSN,
  release: process.env.VERCEL_GIT_COMMIT_SHA,
  dsn: process.env.SENTRY_DSN,
  environment: process.env.VERCEL_ENV as string,
  integrations: [new Integrations.Http({ tracing: true })],
  tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? 1),
})

setTag("app", "api")

let transaction: Transaction

export const sentryWrapper =
  (path: string, handler: CustomHandler): Handler =>
  async (req, res) => {
    let response: NonNullable<CustomHandlerResponse>

    transaction = startTransaction({
      name: path,
      op: "transaction",
    })

    try {
      response = (await handler(req)) ?? {}
    } catch (error: any) {
      response = internal(error.message as string)

      setContext("response", {
        status: res.statusCode,
      })

      Logger.error(error)
      captureException(error)
    }

    transaction.finish()

    await flush(1000)

    if (!isBoom(response)) {
      response.statusCode ??= 200
      const body = {
        ...response,
        ok: true,
      }

      Logger.debug(
        `${req.method as string} ${path} ${res.statusCode}\n${JSON.stringify(
          body,
          null,
          2,
        )}`,
      )
      res.status(response.statusCode).json(body)
    } else {
      const { payload, statusCode, headers } = response.output
      const body = { ...payload, ok: false }

      for (const [key, value] of Object.entries(headers)) {
        res.setHeader(key, value!)
      }

      Logger.debug(
        `${req.method as string} ${path} ${res.statusCode}\n${JSON.stringify(
          body,
          null,
          2,
        )}`,
      )
      res.status(statusCode).json(body)
    }
  }

export const startTask = (name: string) => {
  if (transaction == null) throw new Error("thefuck")

  return transaction.startChild({
    op: "task",
    description: name,
  })
}

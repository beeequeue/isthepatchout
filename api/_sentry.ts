import {
  captureException,
  flush,
  getCurrentHub,
  init,
  Integrations,
  setContext,
  setTag,
  startTransaction,
} from "@sentry/node"
import type { VercelRequest, VercelResponse } from "@vercel/node"

import "@sentry/tracing"

type Handler = (request: VercelRequest, response: VercelResponse) => Promise<void> | void

init({
  debug: true,
  enabled: process.env.VERCEL_ENV !== "development" && !!process.env.SENTRY_DSN,
  release: process.env.VERCEL_GIT_COMMIT_SHA,
  dsn: process.env.SENTRY_DSN,
  environment: process.env.VERCEL_ENV as string,
  integrations: [new Integrations.Http({ tracing: true })],
  tracesSampleRate: 1.0,
})

setTag("app", "api")

export const sentryWrapper = (path: string, handler: Handler): Handler => async (
  req,
  res,
) => {
  const trx = startTransaction({
    name: path,
    op: "transaction",
  })

  try {
    await handler(req, res)
  } catch (error) {
    res.status(500).send({ ok: false, message: error?.message })

    setContext("response", {
      status: res.statusCode,
    })

    captureException(error)
  }

  trx.finish()

  await flush(5000)

  console.log("3", new Date().toISOString())
}

export const startTask = (name: string) => {
  const transaction = getCurrentHub().getScope()?.getTransaction()

  if (transaction == null) throw new Error("thefuck")

  return transaction.startChild({
    op: "task",
    description: name,
  })
}

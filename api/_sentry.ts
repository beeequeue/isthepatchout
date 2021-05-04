import {
  captureException,
  getCurrentHub,
  init,
  Integrations,
  setContext,
  startTransaction,
} from "@sentry/node"
import type { VercelRequest, VercelResponse } from "@vercel/node"

import "@sentry/tracing"

type Handler = (request: VercelRequest, response: VercelResponse) => Promise<void> | void

console.log(
  Object.entries(process.env).filter(
    ([key]) => key.includes("VERCEL") || key.includes("VITE") || key.includes("SENTRY"),
  ),
)
init({
  debug: true,
  enabled: process.env.VERCEL_ENV !== "development" && !!process.env.VITE_SENTRY_DSN,
  dsn: process.env.VITE_SENTRY_DSN,
  environment: process.env.VERCEL_ENV as string,
  integrations: [new Integrations.Http({ tracing: true })],
  sampleRate: 1.0,
  tracesSampleRate: 1.0,
})

export const sentryWrapper = (path: string, handler: Handler): Handler => async (
  req,
  res,
) => {
  let error: Error | null = null
  const trx = startTransaction({
    name: path,
    op: "transaction",
  })

  try {
    await handler(req, res)
  } catch (foundError) {
    error = foundError
    res.status(500).send({ ok: false, message: error?.message })
  }

  setContext("response", {
    status: res.statusCode,
  })

  if (res.statusCode >= 500) {
    captureException(error ? error : new Error(`Returned a ${res.statusCode} response`))
  }

  trx.finish()
}

export const startTask = (name: string) => {
  const transaction = getCurrentHub().getScope()?.getTransaction()

  if (transaction == null) throw new Error("thefuck")

  return transaction.startChild({
    op: "task",
    description: name,
  })
}

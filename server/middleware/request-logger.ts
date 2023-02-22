import { defineEventHandler } from "h3"
import { nanoid } from "nanoid"
import { pinoHttp } from "pino-http"

const requestLogger = pinoHttp({
  logger: Logger,
  redact: ["*.headers.authorization", "*.headers.cookie", "*.headers['x-forwarded-for']"],
  quietReqLogger: true,

  autoLogging: {
    ignore: (req) => req.url?.includes("__nuxt_error") ?? false,
  },
  genReqId: () => nanoid(10),
  customReceivedMessage: () => "req",
  customSuccessMessage: () => "res",
  customErrorMessage: () => "error",
})

export default defineEventHandler((event) => {
  requestLogger(event.node.req, event.node.res)
})

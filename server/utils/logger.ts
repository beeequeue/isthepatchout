import Pino from "pino"
import Pretty from "pino-pretty"

const isDev = process.env.VERCEL_ENV === "development"

export const Logger = Pino(
  {
    level: isDev ? "debug" : "info",
  },
  isDev ? Pretty() : undefined!,
)

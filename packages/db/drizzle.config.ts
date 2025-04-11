import { env } from "@repo/env"
import type { Config } from "drizzle-kit"

const nonPoolingUrl = env.POSTGRES_URL.replace(":6543", ":5432")

export default {
  schema: "./src/schema",
  dialect: "postgresql",
  out: "../../supabase/migrations",
  migrations: {
    prefix: "supabase"
  },
  schemaFilter: ["public"],
  verbose: true,
  strict: true,
  dbCredentials: { url: nonPoolingUrl }
} satisfies Config

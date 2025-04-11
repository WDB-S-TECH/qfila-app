import { env } from "@repo/env"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

import * as schema from "./schema"

const client = postgres(env.POSTGRES_URL, { prepare: false })

export const db = drizzle(client, { schema })
export type DBClient = typeof db

/**
 * ! Executing this script will delete all data in your database and seed it with 10 users.
 * ! Make sure to adjust the script to your needs.
 * Use any TypeScript runner to run this script, for example: `npx tsx seed.ts`
 * Learn more about the Seed Client by following our guide: https://docs.snaplet.dev/seed/getting-started
 */

import { reset } from "drizzle-seed"

import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

import * as schema from "../schema"

import { createAuthUsers } from "./funcs/authUsers_seed"

const main = async () => {
  const connectionString = process.env.POSTGRES_URL
  if (!connectionString || !connectionString.includes("127.0.0.1")) {
    console.log("Seeding is only available in development mode")
    process.exit(0)
  }

  const client = postgres(process.env.POSTGRES_URL!, { prepare: false })
  const db = drizzle(client, { schema })

  const { StorageBucketsTable, ...resetSchema } = schema

  try {
    await reset(db, resetSchema)

    // Seed Default Users
    console.log("Seeding default users Start")
    console.time("Seeding default users")
    const _defaultUsers = await createAuthUsers(db, 0)
    console.timeEnd("Seeding default users")

    process.exit(0)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

main()
  .then(() => {
    console.log("Database seeded successfully!")
  })
  .catch((error) => {
    console.error(error)
  })

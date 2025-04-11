import type { AdminUserAttributes } from "@supabase/supabase-js"
import { createClient } from "@supabase/supabase-js"

import type { DBClient } from "../../client"

export const USERS_UUID_TYPE = [
  {
    email: "admin@admin.com"
  },
  {
    email: "manager@manager.com"
  },
  {
    email: "user@user.com"
  },
  {
    email: "developer@developer.com"
  }
]

export async function createAuthUsers(_seed?: DBClient, _extra = 50) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const users = await generateSupabaseAuthUsers()

  const newUsers = await Promise.all(
    users.map((user) => {
      return supabase.auth.admin.createUser(user)
    })
  )

  // console.log(newUsers)
  const authUsers = newUsers.map((user) => user.data.user).filter((u) => !!u)

  return authUsers
}

async function generateSupabaseAuthUsers(pass = "123456") {
  return USERS_UUID_TYPE.map((user) => {
    const { email } = user

    return {
      role: "authenticated",
      email: email,
      password: pass,
      email_confirm: true,
      user_metadata: {},
      app_metadata: {}
    } satisfies AdminUserAttributes
  })
}

import { sql } from "drizzle-orm"
import {
  bigint,
  boolean,
  check,
  foreignKey,
  index,
  jsonb,
  pgSchema,
  smallint,
  text,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
  varchar
} from "drizzle-orm/pg-core"

export const auth = pgSchema("auth")
export const storage = pgSchema("storage")

export const AuthUsersTable = auth.table(
  "users",
  {
    instanceId: uuid("instance_id"),
    id: uuid().primaryKey().notNull(),
    aud: varchar({ length: 255 }),
    role: varchar({ length: 255 }),
    email: varchar({ length: 255 }),
    encryptedPassword: varchar("encrypted_password", { length: 255 }),
    emailConfirmedAt: timestamp("email_confirmed_at", {
      withTimezone: true,
      mode: "string"
    }),
    invitedAt: timestamp("invited_at", { withTimezone: true, mode: "string" }),
    confirmationToken: varchar("confirmation_token", { length: 255 }),
    confirmationSentAt: timestamp("confirmation_sent_at", {
      withTimezone: true,
      mode: "string"
    }),
    recoveryToken: varchar("recovery_token", { length: 255 }),
    recoverySentAt: timestamp("recovery_sent_at", {
      withTimezone: true,
      mode: "string"
    }),
    emailChangeTokenNew: varchar("email_change_token_new", { length: 255 }),
    emailChange: varchar("email_change", { length: 255 }),
    emailChangeSentAt: timestamp("email_change_sent_at", {
      withTimezone: true,
      mode: "string"
    }),
    lastSignInAt: timestamp("last_sign_in_at", {
      withTimezone: true,
      mode: "string"
    }),
    rawAppMetaData: jsonb("raw_app_meta_data"),
    rawUserMetaData: jsonb("raw_user_meta_data"),
    isSuperAdmin: boolean("is_super_admin"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" }),
    phone: text().default(sql`NULL`),
    phoneConfirmedAt: timestamp("phone_confirmed_at", {
      withTimezone: true,
      mode: "string"
    }),
    phoneChange: text("phone_change").default(""),
    phoneChangeToken: varchar("phone_change_token", { length: 255 }).default(
      ""
    ),
    phoneChangeSentAt: timestamp("phone_change_sent_at", {
      withTimezone: true,
      mode: "string"
    }),
    confirmedAt: timestamp("confirmed_at", {
      withTimezone: true,
      mode: "string"
    }).generatedAlwaysAs(sql`LEAST(email_confirmed_at, phone_confirmed_at)`),
    emailChangeTokenCurrent: varchar("email_change_token_current", {
      length: 255
    }).default(""),
    emailChangeConfirmStatus: smallint("email_change_confirm_status").default(
      0
    ),
    bannedUntil: timestamp("banned_until", {
      withTimezone: true,
      mode: "string"
    }),
    reauthenticationToken: varchar("reauthentication_token", {
      length: 255
    }).default(""),
    reauthenticationSentAt: timestamp("reauthentication_sent_at", {
      withTimezone: true,
      mode: "string"
    }),
    isSsoUser: boolean("is_sso_user").default(false).notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true, mode: "string" }),
    isAnonymous: boolean("is_anonymous").default(false).notNull()
  },
  (table) => [
    uniqueIndex("confirmation_token_idx")
      .using("btree", table.confirmationToken.asc().nullsLast().op("text_ops"))
      .where(sql`((confirmation_token)::text !~ '^[0-9 ]*$'::text)`),
    uniqueIndex("email_change_token_current_idx")
      .using(
        "btree",
        table.emailChangeTokenCurrent.asc().nullsLast().op("text_ops")
      )
      .where(sql`((email_change_token_current)::text !~ '^[0-9 ]*$'::text)`),
    uniqueIndex("email_change_token_new_idx")
      .using(
        "btree",
        table.emailChangeTokenNew.asc().nullsLast().op("text_ops")
      )
      .where(sql`((email_change_token_new)::text !~ '^[0-9 ]*$'::text)`),
    uniqueIndex("reauthentication_token_idx")
      .using(
        "btree",
        table.reauthenticationToken.asc().nullsLast().op("text_ops")
      )
      .where(sql`((reauthentication_token)::text !~ '^[0-9 ]*$'::text)`),
    uniqueIndex("recovery_token_idx")
      .using("btree", table.recoveryToken.asc().nullsLast().op("text_ops"))
      .where(sql`((recovery_token)::text !~ '^[0-9 ]*$'::text)`),
    uniqueIndex("users_email_partial_key")
      .using("btree", table.email.asc().nullsLast().op("text_ops"))
      .where(sql`(is_sso_user = false)`),
    index("users_instance_id_email_idx").using(
      "btree",
      sql`instance_id`,
      sql`null`
    ),
    index("users_instance_id_idx").using(
      "btree",
      table.instanceId.asc().nullsLast().op("uuid_ops")
    ),
    index("users_is_anonymous_idx").using(
      "btree",
      table.isAnonymous.asc().nullsLast().op("bool_ops")
    ),
    unique("users_phone_key").on(table.phone),
    check(
      "users_email_change_confirm_status_check",
      sql`(email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)`
    )
  ]
)

export type AuthUsersTableType = typeof AuthUsersTable.$inferSelect

export const StorageBucketsTable = storage.table(
  "buckets",
  {
    id: text().primaryKey().notNull(),
    name: text().notNull(),
    owner: uuid(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string"
    }).defaultNow(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string"
    }).defaultNow(),
    public: boolean().default(false),
    avifAutodetection: boolean("avif_autodetection").default(false),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    fileSizeLimit: bigint("file_size_limit", { mode: "number" }),
    allowedMimeTypes: text("allowed_mime_types").array(),
    ownerId: text("owner_id")
  },
  (table) => [
    uniqueIndex("bname").using(
      "btree",
      table.name.asc().nullsLast().op("text_ops")
    )
  ]
)

export const StorageObjectsTable = storage.table(
  "objects",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    bucketId: text("bucket_id"),
    name: text(),
    owner: uuid(),
    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "string"
    }).defaultNow(),
    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "string"
    }).defaultNow(),
    lastAccessedAt: timestamp("last_accessed_at", {
      withTimezone: true,
      mode: "string"
    }).defaultNow(),
    metadata: jsonb(),
    pathTokens: text("path_tokens")
      .array()
      .generatedAlwaysAs(sql`string_to_array(name, '/'::text)`),
    version: text(),
    ownerId: text("owner_id"),
    userMetadata: jsonb("user_metadata")
  },
  (table) => [
    uniqueIndex("bucketid_objname").using(
      "btree",
      table.bucketId.asc().nullsLast().op("text_ops"),
      table.name.asc().nullsLast().op("text_ops")
    ),
    index("idx_objects_bucket_id_name").using(
      "btree",
      table.bucketId.asc().nullsLast().op("text_ops"),
      table.name.asc().nullsLast().op("text_ops")
    ),
    index("name_prefix_search").using(
      "btree",
      table.name.asc().nullsLast().op("text_pattern_ops")
    ),
    foreignKey({
      columns: [table.bucketId],
      foreignColumns: [StorageBucketsTable.id],
      name: "objects_bucketId_fkey"
    })
  ]
)

export type StorageObjectsTableType = typeof StorageObjectsTable.$inferSelect

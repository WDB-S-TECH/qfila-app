import { relations } from "drizzle-orm/relations"
import { StorageBucketsTable, StorageObjectsTable } from "./supabase.schema"

export const objectsInStorageRelations = relations(
  StorageObjectsTable,
  ({ one }) => ({
    bucketsInStorage: one(StorageBucketsTable, {
      fields: [StorageObjectsTable.bucketId],
      references: [StorageBucketsTable.id]
    })
  })
)

import {
  pgTable,
  serial,
  text,
  varchar,
  boolean,
  timestamp,
  integer,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// --- Users Table ---
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  socialOnly: boolean("social_only").default(false).notNull(),
  email: varchar("email", { length: 256 }).notNull().unique(),
  username: varchar("username", { length: 256 }).notNull().unique(),
  password: text("password"),
  nickname: varchar("nickname", { length: 256 }),
  location: varchar("location", { length: 256 }),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// --- Threads Table ---
export const threads = pgTable("threads", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 80 }).notNull(),
  content: text("content").notNull(),
  fileType: text("file_type"),
  fileUrl: text("file_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  ownerId: integer("owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

// --- Relations ---
export const usersRelations = relations(users, ({ many }) => ({
  // A user can have many threads. The 'threads' table references this user via 'ownerId'.
  threads: many(threads),
}));
export const threadsRelations = relations(threads, ({ one }) => ({
  // A thread belongs to one owner (user). The 'ownerId' field connects to the 'users' table's 'id'.
  owner: one(users, {
    fields: [threads.ownerId],
    references: [users.id],
  }),
}));

// --- Type exports for easy use in application code ---
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Thread = typeof threads.$inferSelect;
export type NewThread = typeof threads.$inferInsert;

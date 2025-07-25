import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// --- User Model ---
export const users = pgTable("users", {
  avatarUrl: varchar("avatar_url", { length: 128 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  email: varchar("email", { length: 64 }).unique(),
  id: serial("id").primaryKey(),
  isActive: boolean("is_active").default(true).notNull(),
  nickname: varchar("nickname", { length: 32 }),
  password: text("password"),
  socialOnly: boolean("social_only").default(false).notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
  username: varchar("username", { length: 16 }).unique(),
  verifiedAt: timestamp("verified_at"),
  withdrawedAt: timestamp("withdrawed_at"),
});
export const usersRelations = relations(users, ({ many }) => ({
  // A user can have many threads. The 'threads' table references this user via 'ownerId'.
  threads: many(threads),
}));
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

// --- Thread Model ---
export const threads = pgTable("threads", {
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  fileUrl: varchar("file_url", { length: 128 }),
  id: serial("id").primaryKey(),
  isPublic: boolean("is_public").default(true).notNull(),
  tags: text("tags"),
  updatedAt: timestamp("updated_at").defaultNow(),
  views: integer("views").default(0).notNull(),

  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});
export const threadsRelations = relations(threads, ({ one }) => ({
  // A thread belongs to one owner (user). The 'userId' field connects to the 'users' table's 'id'.
  user: one(users, {
    fields: [threads.userId],
    references: [users.id],
  }),
}));
export type Thread = typeof threads.$inferSelect;
export type NewThread = typeof threads.$inferInsert;

// --- Like Model ---
export const likes = pgTable(
  "likes",
  {
    createdAt: timestamp("created_at").defaultNow().notNull(),

    threadId: integer("thread_id")
      .notNull()
      .references(() => threads.id, { onDelete: "cascade" }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [
    {
      pk: primaryKey({ columns: [table.threadId, table.userId] }),
    },
  ]
);
export type Like = typeof likes.$inferSelect;
export type NewLike = typeof likes.$inferInsert;

// --- Comment Model ---
export const comments = pgTable("comments", {
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  id: serial("id").primaryKey(),
  updatedAt: timestamp("updated_at").defaultNow(),

  threadId: integer("thread_id")
    .notNull()
    .references(() => threads.id, { onDelete: "cascade" }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});
export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;

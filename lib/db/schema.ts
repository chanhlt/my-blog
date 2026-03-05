// lib/db/schema.ts
import {
  pgTable,
  text,
  integer,
  timestamp,
  boolean,
  serial,
  varchar,
} from "drizzle-orm/pg-core";

// ───────────────────────────────────────────────
// post_views
// Mỗi bài viết có một row. view_count tăng dần mỗi lượt xem.
// ───────────────────────────────────────────────
export const postViews = pgTable("post_views", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  viewCount: integer("view_count").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ───────────────────────────────────────────────
// subscribers
// Danh sách email newsletter với double opt-in verification.
// ───────────────────────────────────────────────
export const subscribers = pgTable("subscribers", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  verifiedAt: timestamp("verified_at"),
  verifyToken: varchar("verify_token", { length: 64 }).notNull(),
  unsubscribeToken: varchar("unsubscribe_token", { length: 64 }).notNull(),
  isActive: boolean("is_active").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ───────────────────────────────────────────────
// comments
// Comment của người đọc theo bài viết — cần duyệt trước khi hiển thị.
// ───────────────────────────────────────────────
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).notNull(),
  authorName: varchar("author_name", { length: 100 }).notNull(),
  authorEmail: varchar("author_email", { length: 255 }),
  content: text("content").notNull(),
  isApproved: boolean("is_approved").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

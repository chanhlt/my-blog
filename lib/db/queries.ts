// lib/db/queries.ts
import { eq, desc, and, sql } from "drizzle-orm";
import { db } from "./index";
import { postViews, subscribers, comments } from "./schema";
import crypto from "crypto";

// ─────────────────────────────────────────────────────────────────────────────
// Post Views
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Lấy view count hiện tại của một bài viết.
 * Trả về 0 nếu bài chưa được xem lần nào.
 */
export async function getPostViewCount(slug: string): Promise<number> {
  const result = await db
    .select({ viewCount: postViews.viewCount })
    .from(postViews)
    .where(eq(postViews.slug, slug))
    .limit(1);

  return result[0]?.viewCount ?? 0;
}

/**
 * Tăng view count thêm 1.
 * Tự tạo row nếu chưa tồn tại (upsert pattern).
 */
export async function incrementPostView(slug: string): Promise<void> {
  await db
    .insert(postViews)
    .values({ slug, viewCount: 1 })
    .onConflictDoUpdate({
      target: postViews.slug,
      set: {
        viewCount: sql`${postViews.viewCount} + 1`,
        updatedAt: new Date(),
      },
    });
}

// ─────────────────────────────────────────────────────────────────────────────
// Newsletter Subscribers
// ─────────────────────────────────────────────────────────────────────────────

function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Tạo subscriber mới (mặc định chưa verified).
 * Trả về verification token để gửi qua email.
 */
export async function createSubscriber(
  email: string
): Promise<{ verifyToken: string; unsubscribeToken: string } | null> {
  const verifyToken = generateToken();
  const unsubscribeToken = generateToken();

  try {
    await db.insert(subscribers).values({
      email,
      verifyToken,
      unsubscribeToken,
      isActive: false,
    });
    return { verifyToken, unsubscribeToken };
  } catch {
    // Email đã tồn tại
    return null;
  }
}

/**
 * Đánh dấu subscriber là đã verified và active.
 */
export async function verifySubscriber(verifyToken: string): Promise<boolean> {
  const result = await db
    .update(subscribers)
    .set({ isActive: true, verifiedAt: new Date() })
    .where(
      and(
        eq(subscribers.verifyToken, verifyToken),
        eq(subscribers.isActive, false)
      )
    )
    .returning({ id: subscribers.id });

  return result.length > 0;
}

/**
 * Hủy kích hoạt subscriber (unsubscribe).
 */
export async function unsubscribeByToken(
  unsubscribeToken: string
): Promise<boolean> {
  const result = await db
    .update(subscribers)
    .set({ isActive: false })
    .where(eq(subscribers.unsubscribeToken, unsubscribeToken))
    .returning({ id: subscribers.id });

  return result.length > 0;
}

/**
 * Lấy tất cả subscriber đang active (đã verified) để gửi newsletter.
 */
export async function getActiveSubscribers(): Promise<
  { email: string; unsubscribeToken: string }[]
> {
  return db
    .select({
      email: subscribers.email,
      unsubscribeToken: subscribers.unsubscribeToken,
    })
    .from(subscribers)
    .where(eq(subscribers.isActive, true));
}

// ─────────────────────────────────────────────────────────────────────────────
// Comments
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Lấy tất cả comment đã được duyệt của một bài viết.
 */
export async function getApprovedComments(slug: string) {
  return db
    .select()
    .from(comments)
    .where(and(eq(comments.slug, slug), eq(comments.isApproved, true)))
    .orderBy(desc(comments.createdAt));
}

/**
 * Gửi comment mới (cần được duyệt trước khi hiển thị).
 */
export async function createComment(data: {
  slug: string;
  authorName: string;
  authorEmail?: string;
  content: string;
}): Promise<void> {
  await db.insert(comments).values({
    ...data,
    isApproved: false, // luôn pending moderation
  });
}

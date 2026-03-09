import { Metadata } from "next";
import Link from "next/link";
import { Pin } from "lucide-react";
import { getPostsByTag, getAllTags, paginatePosts } from "@/lib/posts";
import { TagBadge } from "@/components/TagBadge";
import { Pagination } from "@/components/Pagination";

interface PageProps {
  params: Promise<{ tag: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const posts = getPostsByTag(decodedTag);
  return {
    title: `Posts tagged "${decodedTag}"`,
    description: `${posts.length} bài viết với tag "${decodedTag}"`,
    openGraph: {
      title: `Posts tagged "${decodedTag}"`,
      description: `${posts.length} bài viết với tag "${decodedTag}"`,
    },
  };
}

export function generateStaticParams() {
  const tags = getAllTags();
  return tags.map((tag) => ({ tag: encodeURIComponent(tag.name) }));
}

export default async function TagPage({ params, searchParams }: PageProps) {
  const { tag } = await params;
  const { page } = await searchParams;
  const decodedTag = decodeURIComponent(tag);
  const currentPage = Number(page) || 1;

  const allPosts = getPostsByTag(decodedTag);
  const { posts, totalPages } = paginatePosts(allPosts, currentPage);
  const allTags = getAllTags();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link
          href="/blog"
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4"
        >
          ← Quay lại blog
        </Link>
        <h1 className="text-4xl font-bold mb-2">
          Tag: {decodedTag}
        </h1>
        <p className="text-muted-foreground">
          {allPosts.length} bài viết
        </p>
      </div>

      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {allTags.map((t) => (
            <TagBadge
              key={t.name}
              tag={t.name}
              count={t.count}
              clickable={t.name !== decodedTag.toLowerCase()}
            />
          ))}
        </div>
      )}

      {posts.length === 0 ? (
        <p className="text-muted-foreground">Không có bài viết nào với tag này.</p>
      ) : (
        <div className="space-y-8">
          {posts.map((post) => (
            <article key={post.slug} className="group">
              <Link href={`/blog/${post.slug}`}>
                <div className="border rounded-lg p-6 transition-colors hover:bg-accent">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <time>{post.date}</time>
                    <span>·</span>
                    <span>{post.readingTime} min read</span>
                    {post.featured && (
                      <>
                        <span>·</span>
                        <span className="inline-flex items-center gap-1 text-primary font-medium">
                          <Pin className="h-3 w-3" /> Featured
                        </span>
                      </>
                    )}
                  </div>
                  <h2 className="text-2xl font-semibold mt-1 mb-2 group-hover:text-primary">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground">{post.description}</p>
                  {post.tags.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      {post.tags.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath={`/blog/tags/${encodeURIComponent(decodedTag)}`}
      />
    </div>
  );
}

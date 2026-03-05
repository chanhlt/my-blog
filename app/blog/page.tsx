// app/blog/page.tsx
import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export default function BlogPage() {
  const posts = getAllPosts();
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      {posts.length === 0 ? (
        <p className="text-muted-foreground">Chưa có bài nào. Quay lại sau nhé!</p>
      ) : (
        <div className="space-y-8">
          {posts.map((post) => (
            <article key={post.slug} className="group">
              <Link href={`/blog/${post.slug}`}>
                <div className="border rounded-lg p-6 transition-colors hover:bg-accent">
                  <time className="text-sm text-muted-foreground">{post.date}</time>
                  <h2 className="text-2xl font-semibold mt-1 mb-2 group-hover:text-primary">{post.title}</h2>
                  <p className="text-muted-foreground">{post.description}</p>
                  {post.tags.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground"
                        >
                          {tag}
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
    </div>
  );
}
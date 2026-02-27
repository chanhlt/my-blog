// app/blog/page.tsx
import type { Metadata } from "next";
 
export const metadata: Metadata = {
  title: "Blog",
  description: "Tất cả bài viết.",
};
 
export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Blog</h1>
      <p className="text-muted-foreground">Bài viết sẽ xuất hiện ở đây ở Phase 2.</p>
    </div>
  );
}
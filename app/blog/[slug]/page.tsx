import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostBySlug } from '@/lib/posts';
import { compileMDXContent } from '@/lib/mdx';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Bắt buộc render theo yêu cầu (không sinh tĩnh)
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) {
    return { title: 'Không Tìm Thấy Bài Viết' };
  }
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) {
    notFound();
  }
  // Compile MDX mỗi request (render theo yêu cầu)
  const content = await compileMDXContent(post.content);
  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      <header className="mb-8">
        <Link
          href="/blog"
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6"
        >
          ← Quay lại blog
        </Link>
        <time className="block text-sm text-muted-foreground mb-2">{post.date}</time>
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-sm rounded-full bg-secondary text-secondary-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>
      {/* Class prose cho typography đẹp */}
      <div className="prose prose-slate dark:prose-invert max-w-none">
        {content}
      </div>
    </article>
  );
}

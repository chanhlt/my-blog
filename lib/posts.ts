import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Interface TypeScript cho metadata bài viết
export interface PostMeta {
  title: string;
  description: string;
  date: string;
  tags: string[];
  image?: string;
  slug: string;
}

// Bài viết đầy đủ = metadata + nội dung MDX thô
export interface Post extends PostMeta {
  content: string;
}

const POSTS_DIR = path.join(process.cwd(), 'content/posts');

function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function getAllPosts(): PostMeta[] {
  // 1. Đọc tất cả tên file .mdx từ thư mục posts
  const filenames = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.mdx'));
  // 2. Parse frontmatter từ mỗi file
  const posts = filenames.map(filename => {
    const slug = filename.replace(/\.mdx$/, '');
    const fullPath = path.join(POSTS_DIR, filename);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);
    return {
      slug,
      title: data.title,
      description: data.description,
      date: formatDate(data.date),
      tags: data.tags || [],
      image: data.image,
    };
  });
  // 3. Sắp xếp theo ngày (mới nhất trước)
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): Post | null {
  const fullPath = path.join(POSTS_DIR, `${slug}.mdx`);
  // Trả về null nếu file không tồn tại
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  return {
    slug,
    title: data.title,
    description: data.description,
    date: formatDate(data.date),
    tags: data.tags || [],
    image: data.image,
    content, // Chuỗi MDX thô — sẽ compile sau
  };
}

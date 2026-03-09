import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface PostMeta {
  title: string;
  description: string;
  date: string;
  tags: string[];
  image?: string;
  slug: string;
  featured?: boolean;
  readingTime: number;
}

export interface Post extends PostMeta {
  content: string;
}

export interface TagInfo {
  name: string;
  count: number;
}

export interface PaginatedResult {
  posts: PostMeta[];
  totalPosts: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export const POSTS_PER_PAGE = 6;

const POSTS_DIR = path.join(process.cwd(), 'content/posts');

function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function calculateReadingTime(content: string): number {
  // Loại bỏ code blocks và frontmatter
  const cleaned = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/^---[\s\S]*?---/, '');
  const words = cleaned.split(/\s+/).filter(w => w.length > 0).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function getAllPosts(): PostMeta[] {
  const filenames = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.mdx'));
  const posts = filenames.map(filename => {
    const slug = filename.replace(/\.mdx$/, '');
    const fullPath = path.join(POSTS_DIR, filename);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    return {
      slug,
      title: data.title,
      description: data.description,
      date: formatDate(data.date),
      tags: data.tags || [],
      image: data.image,
      featured: data.featured || false,
      readingTime: calculateReadingTime(content),
    };
  });
  // Featured trước, rồi theo ngày mới nhất
  return posts.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

export function getPostBySlug(slug: string): Post | null {
  const fullPath = path.join(POSTS_DIR, `${slug}.mdx`);
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
    featured: data.featured || false,
    readingTime: calculateReadingTime(content),
    content,
  };
}

export function getAllTags(): TagInfo[] {
  const posts = getAllPosts();
  const tagMap = new Map<string, number>();
  posts.forEach(post => {
    post.tags.forEach(tag => {
      const normalized = tag.toLowerCase();
      tagMap.set(normalized, (tagMap.get(normalized) || 0) + 1);
    });
  });
  return Array.from(tagMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function getPostsByTag(tag: string): PostMeta[] {
  const posts = getAllPosts();
  return posts.filter(post =>
    post.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  );
}

export function searchPosts(query: string): PostMeta[] {
  if (!query || query.trim() === '') return getAllPosts();
  const words = query.toLowerCase().split(/\s+/).filter(w => w.length > 0);
  const posts = getAllPosts();
  return posts.filter(post => {
    const searchable = `${post.title} ${post.description} ${post.tags.join(' ')}`.toLowerCase();
    return words.every(word => searchable.includes(word));
  });
}

export function paginatePosts(
  posts: PostMeta[],
  page: number,
  perPage: number = POSTS_PER_PAGE
): PaginatedResult {
  const totalPosts = posts.length;
  const totalPages = Math.max(1, Math.ceil(totalPosts / perPage));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * perPage;
  const end = start + perPage;
  return {
    posts: posts.slice(start, end),
    totalPosts,
    totalPages,
    currentPage,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
}

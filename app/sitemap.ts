import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { siteConfig } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();

  const blogEntries = posts.map((post) => ({
    url: `${siteConfig.url}/blog/${post.slug}`,
    lastModified: new Date(post.date),
  }));

  return [
    { url: siteConfig.url, lastModified: new Date() },
    { url: `${siteConfig.url}/about`, lastModified: new Date() },
    { url: `${siteConfig.url}/blog`, lastModified: new Date() },
    ...blogEntries,
  ];
}

// lib/config.ts
export const siteConfig = {
  name: "Blog Của Tôi",
  description: "Blog cá nhân về phát triển phần mềm.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  author: {
    name: "Tên Của Bạn",
    email: "ban@example.com",
    twitter: "@tentwittercuaban",
  },
  links: {
    github: "https://github.com/tentengithub",
    twitter: "https://twitter.com/tentwittercuaban",
  },
} as const;

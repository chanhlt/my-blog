# Blog Của Tôi

A Vietnamese personal blog built with Next.js 16, shadcn/ui, and Tailwind CSS v4.

## Tech Stack

- **Next.js 16** — App Router, React 19
- **Tailwind CSS v4** — Utility-first styling with OKLch color system
- **shadcn/ui** — Pre-built accessible components (Radix UI primitives)
- **next-themes** — Dark/light mode with system preference detection
- **lucide-react** — Icons
- **TypeScript** — Type safety

## Project Structure

```
app/
├── layout.tsx            # Root layout (metadata, theme, header/footer)
├── page.tsx              # Home page
├── about/page.tsx        # About page
└── blog/
    ├── page.tsx          # Blog listing
    └── [slug]/page.tsx   # Individual blog post

components/
├── Header.tsx            # Sticky nav with responsive mobile menu
├── Footer.tsx            # Footer with social links
├── ThemeProvider.tsx      # next-themes wrapper
├── ThemeToggle.tsx        # Dark/light mode toggle
└── ui/                   # shadcn/ui components

lib/
├── config.ts             # Site configuration
└── utils.ts              # Utility functions

content/posts/            # Blog post content (Phase 2)
```

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start development server |
| `npm run build` | Build for production     |
| `npm run start` | Start production server  |
| `npm run lint`  | Run ESLint               |

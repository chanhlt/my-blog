# Blog Của Tôi

A Vietnamese personal blog built with Next.js 16, ShadCN/UI, Tailwind CSS v4, MDX, and PostgreSQL + Drizzle ORM.

## Tech Stack

- **Next.js 16** — App Router, React 19, on-demand MDX rendering
- **Tailwind CSS v4** — Utility-first styling with OKLch color system
- **shadcn/ui** — Pre-built accessible components (Radix UI primitives)
- **next-themes** — Dark/light mode with system preference detection
- **MDX** — Blog posts written in Markdown + JSX (`next-mdx-remote`)
- **gray-matter** — Frontmatter parsing (title, date, tags)
- **rehype-pretty-code + Shiki** — VS Code–quality syntax highlighting
- **Drizzle ORM** — Type-safe SQL ORM for PostgreSQL
- **PostgreSQL 17** — Database via Docker Compose
- **Docker** — Multi-stage build, Compose for dev & production
- **lucide-react** — Icons
- **TypeScript** — Type safety throughout

## Project Structure

```
app/
├── layout.tsx                  # Root layout (metadata, theme, header/footer)
├── page.tsx                    # Home page
├── about/page.tsx              # About page
├── blog/
│   ├── page.tsx                # Blog listing (reads MDX from disk)
│   └── [slug]/page.tsx         # Post detail — on-demand MDX rendering
└── api/
    ├── views/[slug]/route.ts   # GET/POST view counter
    └── subscribe/route.ts      # POST newsletter subscription

components/
├── Header.tsx                  # Sticky nav with responsive mobile menu
├── Footer.tsx                  # Footer with social links
├── ThemeProvider.tsx           # next-themes wrapper
├── ThemeToggle.tsx             # Dark/light mode toggle
├── ViewCounter.tsx             # Realtime view count (client component)
├── SubscribeForm.tsx           # Newsletter subscribe form
└── ui/                         # shadcn/ui components

lib/
├── config.ts                   # Site configuration
├── utils.ts                    # Utility functions
├── posts.ts                    # getAllPosts() / getPostBySlug() — reads MDX
├── mdx.ts                      # compileMDXContent() — remark/rehype pipeline
└── db/
    ├── index.ts                # Drizzle client singleton
    ├── schema.ts               # post_views, subscribers, comments tables
    └── queries.ts              # CRUD helper functions

content/posts/                  # MDX blog post files
drizzle/                        # Generated SQL migrations
Dockerfile                      # Multi-stage build (deps → builder → runner)
docker-compose.yml              # Dev: PostgreSQL + Next.js app
docker-compose.prod.yml         # Production overrides (restart, logging, localhost-only)
.dockerignore                   # Excludes node_modules, .next, etc.
.env.example                    # Environment variable template
drizzle.config.ts               # Drizzle Kit configuration
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the database

```bash
docker compose up -d db
```

### 3. Set up environment variables

Create `.env.local` in the project root:

```env
DATABASE_URL=postgres://blog_user:blog_password@localhost:5433/blog_db
```

### 4. Run migrations

```bash
npm run db:migrate
```

### 5. Start the dev server

```bash
npm run dev
```

Open [http://localhost:3003](http://localhost:3003) to view the site.

### Docker (full stack)

```bash
# Development — builds app + starts PostgreSQL
docker compose up -d --build

# Production — with restart policies, log rotation, localhost-only port
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Stop (preserves data)
docker compose down

# Stop and delete data
docker compose down -v
```

## Scripts

| Command              | Description                              |
| -------------------- | ---------------------------------------- |
| `npm run dev`        | Start development server                 |
| `npm run build`      | Build for production                     |
| `npm run start`      | Start production server                  |
| `npm run lint`       | Run ESLint                               |
| `npm run db:generate`| Generate SQL migration from schema changes|
| `npm run db:migrate` | Apply pending migrations to the database |
| `npm run db:studio`  | Open Drizzle Studio at localhost:4983    |
| `npm run db:push`    | Push schema directly (dev only)          |

## Series

This project is built as part of the [Build a Personal Blog](https://chanhle.dev/vi/blog/personal-blog-nextjs-roadmap) series:

| Phase | Topic |
| ----- | ----- |
| Phase 1 | Next.js 16 + ShadCN/UI Setup |
| Phase 2 | MDX On-Demand Rendering |
| Phase 3 | PostgreSQL + Drizzle ORM |
| Phase 4 | Tags, Search & Pagination |
| Phase 5 | Docker Compose |
| Phase 6 | Deploy to Ubuntu VPS _(coming soon)_ |

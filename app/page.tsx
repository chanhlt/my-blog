// app/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/config";
 
export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <h1 className="text-4xl font-bold tracking-tight mb-4">
        Xin chào, tôi là {siteConfig.author.name}
      </h1>
      <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
        {siteConfig.description}
      </p>
      <div className="flex gap-3">
        <Button asChild>
          <Link href="/blog">Đọc blog</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/about">Về tôi</Link>
        </Button>
      </div>
    </div>
  );
}
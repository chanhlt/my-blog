// app/about/page.tsx
import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";
 
export const metadata: Metadata = {
  title: "Giới Thiệu",
  description: `Về ${siteConfig.author.name}.`,
};
 
export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-4">Giới Thiệu</h1>
      <p className="text-muted-foreground leading-relaxed">
        Xin chào, tôi là {siteConfig.author.name}. Tôi viết về phát triển phần
        mềm, công cụ và những thứ tôi đang học.
      </p>
    </div>
  );
}

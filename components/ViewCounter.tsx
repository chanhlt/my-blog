// components/ViewCounter.tsx
"use client";

import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

interface ViewCounterProps {
  slug: string;
  shouldCount?: boolean; // false trên trang danh sách, true trên trang chi tiết
}

export function ViewCounter({ slug, shouldCount = false }: ViewCounterProps) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    const method = shouldCount ? "POST" : "GET";

    fetch(`/api/views/${slug}`, { method })
      .then((res) => res.json())
      .then((data) => setViews(data.views))
      .catch(() => setViews(null));
  }, [slug, shouldCount]);

  if (views === null) return null;

  return (
    <span className="flex items-center gap-1 text-sm text-muted-foreground">
      <Eye className="h-4 w-4" />
      {views.toLocaleString()} lượt xem
    </span>
  );
}

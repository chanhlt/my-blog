import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface TagBadgeProps {
  tag: string;
  count?: number;
  clickable?: boolean;
}

export function TagBadge({ tag, count, clickable = true }: TagBadgeProps) {
  const label = count !== undefined ? `${tag} (${count})` : tag;

  if (!clickable) {
    return <Badge variant="default">{label}</Badge>;
  }

  return (
    <Link href={`/blog/tags/${encodeURIComponent(tag)}`}>
      <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
        {label}
      </Badge>
    </Link>
  );
}

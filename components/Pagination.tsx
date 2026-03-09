import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  searchParams?: Record<string, string>;
}

function buildUrl(
  basePath: string,
  page: number,
  searchParams?: Record<string, string>
) {
  const params = new URLSearchParams(searchParams);
  if (page > 1) {
    params.set("page", String(page));
  } else {
    params.delete("page");
  }
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export function Pagination({
  currentPage,
  totalPages,
  basePath,
  searchParams,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  // Hiển thị tối đa 5 trang, căn giữa trang hiện tại
  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  const end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <nav className="flex items-center justify-center gap-1 mt-8" aria-label="Pagination">
      <Button variant="outline" size="icon" asChild disabled={currentPage <= 1}>
        <Link href={buildUrl(basePath, 1, searchParams)} aria-label="Trang đầu">
          <ChevronsLeft className="h-4 w-4" />
        </Link>
      </Button>
      <Button variant="outline" size="icon" asChild disabled={currentPage <= 1}>
        <Link href={buildUrl(basePath, currentPage - 1, searchParams)} aria-label="Trang trước">
          <ChevronLeft className="h-4 w-4" />
        </Link>
      </Button>

      {pages.map((page) => (
        <Button
          key={page}
          variant={page === currentPage ? "default" : "outline"}
          size="icon"
          asChild={page !== currentPage}
        >
          {page === currentPage ? (
            <span>{page}</span>
          ) : (
            <Link href={buildUrl(basePath, page, searchParams)}>{page}</Link>
          )}
        </Button>
      ))}

      <Button variant="outline" size="icon" asChild disabled={currentPage >= totalPages}>
        <Link href={buildUrl(basePath, currentPage + 1, searchParams)} aria-label="Trang sau">
          <ChevronRight className="h-4 w-4" />
        </Link>
      </Button>
      <Button variant="outline" size="icon" asChild disabled={currentPage >= totalPages}>
        <Link href={buildUrl(basePath, totalPages, searchParams)} aria-label="Trang cuối">
          <ChevronsRight className="h-4 w-4" />
        </Link>
      </Button>
    </nav>
  );
}

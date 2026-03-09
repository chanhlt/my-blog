"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Search, X, Loader2 } from "lucide-react";

export function SearchBar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const currentQuery = searchParams.get("q") || "";

  function handleSearch(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("q", value);
    } else {
      params.delete("q");
    }
    params.delete("page");
    startTransition(() => {
      router.push(`/blog?${params.toString()}`);
    });
  }

  function clearSearch() {
    handleSearch("");
  }

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder="Tìm bài viết..."
        defaultValue={currentQuery}
        onChange={(e) => handleSearch(e.target.value)}
        className="pl-9 pr-9"
      />
      {isPending ? (
        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
      ) : currentQuery ? (
        <button
          onClick={clearSearch}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}

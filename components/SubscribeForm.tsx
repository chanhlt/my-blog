// components/SubscribeForm.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message);
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error ?? "Có lỗi xảy ra. Thử lại nhé.");
      }
    } catch {
      setStatus("error");
      setMessage("Lỗi mạng. Vui lòng thử lại.");
    }
  }

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm">
      <h3 className="text-lg font-semibold">Nhận bài viết mới</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Bài viết mới gửi thẳng vào inbox. Không spam, unsubscribe bất cứ lúc nào.
      </p>

      {status === "success" ? (
        <p className="mt-4 text-sm font-medium text-green-600">✅ {message}</p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <Input
            type="email"
            placeholder="ban@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={status === "loading"}
            className="flex-1"
          />
          <Button type="submit" disabled={status === "loading"}>
            {status === "loading" ? "Đang đăng ký…" : "Đăng ký"}
          </Button>
        </form>
      )}

      {status === "error" && (
        <p className="mt-2 text-sm text-destructive">{message}</p>
      )}
    </div>
  );
}

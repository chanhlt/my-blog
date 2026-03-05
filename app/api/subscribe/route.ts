// app/api/subscribe/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createSubscriber } from "@/lib/db/queries";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || !email.includes("@")) {
    return NextResponse.json(
      { error: "Email không hợp lệ" },
      { status: 400 }
    );
  }

  const result = await createSubscriber(email);

  if (!result) {
    // Email đã đăng ký — không tiết lộ để bảo vệ privacy
    return NextResponse.json({ message: "Kiểm tra hộp thư của bạn nhé!" });
  }

  // TODO Phase 5: gửi email verification với result.verifyToken
  // Tạm thời log token ra để test local
  console.log(`Verification token cho ${email}: ${result.verifyToken}`);

  return NextResponse.json({ message: "Kiểm tra hộp thư của bạn nhé!" });
}

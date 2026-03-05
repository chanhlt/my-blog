// app/api/views/[slug]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getPostViewCount, incrementPostView } from "@/lib/db/queries";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const count = await getPostViewCount(slug);
  return NextResponse.json({ views: count });
}

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  await incrementPostView(slug);
  const count = await getPostViewCount(slug);
  return NextResponse.json({ views: count });
}

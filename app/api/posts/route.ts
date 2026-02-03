import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: { author: true, _count: { select: { comments: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { title, content, authorId } = await request.json();
    const post = await prisma.post.create({
      data: { title, content, authorId },
      include: { author: true }
    });
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: "Create post error" }, { status: 500 });
  }
}

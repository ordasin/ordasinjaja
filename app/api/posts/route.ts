import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const posts = await prisma.post.findMany({
    include: { author: true, _count: { select: { comments: true, votes: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const { title, content, authorId } = await request.json();
  const post = await prisma.post.create({
    data: { title, content, authorId },
    include: { author: true }
  });
  return NextResponse.json(post);
}

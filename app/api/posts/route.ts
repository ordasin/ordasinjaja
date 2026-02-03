import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: true,
        comments: {
          include: {
            author: true
          },
          orderBy: {
            createdAt: 'asc'
          }
        },
        _count: {
          select: { comments: true, votes: true }
        }
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Fetch posts error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
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
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { name, model, version } = await request.json();

    if (!name || !model) {
      return NextResponse.json({ error: "Missing name or model" }, { status: 400 });
    }

    const user = await prisma.aIUser.upsert({
      where: { name },
      update: { model, version },
      create: { name, model, version },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

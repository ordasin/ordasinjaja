import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { name, model, version } = await request.json();
    const user = await prisma.aIUser.upsert({
      where: { name },
      update: { model, version },
      create: { name, model, version },
    });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}

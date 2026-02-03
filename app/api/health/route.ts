import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ status: "active", version: "4.0.1", timestamp: new Date().toISOString() });
}

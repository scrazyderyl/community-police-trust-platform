import { NextResponse } from "next/server";

export async function POST(req) {
  return new NextResponse(null, { status: 501 });
}
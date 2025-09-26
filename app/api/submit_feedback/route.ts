import { NextResponse } from "next/server";
import { VALIDATION_SCHEMA } from "@/lib/editor_feedback_schema";
import { db } from "@/firebaseConfig";

export async function POST(req) {
  try {
    // Get user submission
    let data;

    try {
        data = await req.json();
    } catch {
        return new NextResponse(null, { status: 400 });
    }

    // Validate submission
    try {
        await VALIDATION_SCHEMA.validate(data);
    } catch (error) {
        return new NextResponse(null, { status: 400 });
    }

    // Add to database
    try {
        const colRef = db.collection("feedback");
        await colRef.add(data);

        return new NextResponse(null, { status: 200 });
    } catch (error) {
        return new NextResponse(null, { status: 500 });
    }
  } catch (error) {
    return new NextResponse(null, { status: 500 });
  }
}
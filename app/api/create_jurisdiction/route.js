import { addNewJurisdiction } from "@/services/JurisdictionGisService";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // Get user submission
    let name;

    try {
      name = await req.json();
    } catch {
      return new NextResponse(null, { status: 400 });
    }

    // Data validation
    if (typeof name !== "string") {
      return new NextResponse(null, { status: 400 });
    }

    name = name.trim();

    if (name === "") {
      return new NextResponse(null, { status: 400 });
    }
    
    // Automatically generate ID from name
    let id = name.toUpperCase().replaceAll(" ", "_");

    // Attempt to add the new jurisdiction
    if (await addNewJurisdiction(id, name)) {
      return NextResponse.json(id);
    } else {
      return new NextResponse(null, { status: 409 });
    }
  } catch (error) {
    return new NextResponse(null, { status: 500 });
  }
}
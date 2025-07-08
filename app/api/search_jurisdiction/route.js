import { NextResponse } from "next/server";
import { findJurisdictionsByName } from "@/services/JurisdictionGisService";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    let query = searchParams.get("q");

    // Validate query
    if (!query) {
      return new NextResponse(null, { status: 400 });
    }

    // Return no results on blank query
    query = decodeURIComponent(query).trim();

    if (query === "") {
      return NextResponse.json([]);
    }

    // Do search
    const results = await findJurisdictionsByName(query);

    return NextResponse.json(results);
  } catch (error) {
    return new NextResponse(null, { status: 500 });
  }
}

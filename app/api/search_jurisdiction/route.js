import { NextResponse } from "next/server";
import { findJurisdictionsByName } from "@/services/JurisdictionGisService";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    let query = searchParams.get("q");
    query = decodeURIComponent(query).trim();
    let exclude = searchParams.get("exclude");

    // Do search
    const results = await findJurisdictionsByName(query, exclude);

    return NextResponse.json(results);
  } catch (error) {
    return new NextResponse(null, { status: 500 });
  }
}

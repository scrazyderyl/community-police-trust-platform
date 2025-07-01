import { NextResponse } from "next/server";
import Fuse from "fuse.js";
import JURISDICTION_METADATA from "@/lib/jurisdiction_gis";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    let query = searchParams.get("q") || "";
    query = decodeURIComponent(query);

    if (!query) {
      return NextResponse.json([]);
    }

    const jurisdictions = Object.entries(JURISDICTION_METADATA).map(([id, v]) => ({ id, name: v.name }));
    const fuse = new Fuse(jurisdictions, { keys: ["name"], threshold: 0.4 });
    const results = fuse.search(query).slice(0, 5).map(r => ({
      value: r.item.id,
      label: r.item.name,
    }));

    return NextResponse.json(results);
  } catch (error) {
    return new NextResponse(null, { status: 500 });
  }
}

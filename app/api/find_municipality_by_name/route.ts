import { db } from "@/firebaseConfig";
import { getAllGisData } from "@/lib/jurisdiction";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const osm_id = searchParams.get("q");

  if (typeof osm_id !== "string") {
    return new NextResponse(null, { status: 400 });
  }

  try {
    // Get index
    const gisData = await getAllGisData();

    // Find the key whose value has an osm_id matches
    let matchedKey = null;

    for (const [key, entry] of Object.entries(gisData)) {
      if (entry && typeof entry === "object") {
        const osm = entry["osm_id"];

        if (osm === osm_id) {
          matchedKey = key;
          break;
        }
      }
    }

    if (!matchedKey) {
      return new NextResponse(null, { status: 404 });
    }

    // Fetch the jurisdiction_info document for the matched key
    const infoRef = db.doc(`jurisdiction_info/${matchedKey}`);
    const infoSnap = await infoRef.get()

    if (!infoSnap.exists) {
      return new NextResponse(null, { status: 404 });
    }

    const infoData = infoSnap.data();

    return NextResponse.json({
      id: infoSnap.id,
      name: gisData[matchedKey].name,
      info: infoData
    });
  } catch (error) {
    return new NextResponse(null, { status: 500 });
  }
}
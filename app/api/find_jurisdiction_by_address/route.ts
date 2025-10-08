import { db } from "@/firebaseConfig";
import { getAllGisData } from "@/lib/jurisdiction";
import { NextResponse } from "next/server";

async function getFilingInfo(id) {
  const infoRef = db.doc(`jurisdiction_info/${id}`);
  const infoSnap = await infoRef.get()

  return infoSnap.exists ? infoSnap.data() : null;
}

export async function POST(req) {
  try {
    const address = await req.json();

    if (!address) {
      return new NextResponse(null, { status: 400 });
    }

    // Get index
    const gisData = await getAllGisData();

    // Find a key whose value has an osm_id matches
    const idLookup = new Map();

    for (let [internal_id, metadata] of Object.entries(gisData)) {
      idLookup.set(metadata.osm_id, internal_id);
    }

    const attributes = [address.town, address.village, address.hamlet, address.neighbourhood, address.quarter, address.suburb, address.retail, address.city, address.county];
    let matched_id;

    for (let attribute of attributes) {
      matched_id = idLookup.get(attribute);

      if (matched_id) {
        break;
      }
    }

    if (!matched_id) {
      return new NextResponse(null, { status: 404 });
    }

    // Fetch the jurisdiction_info document
    let filingInfo = await getFilingInfo(matched_id);
    
    // Resolve defer
    while (filingInfo && filingInfo.defer) {
      filingInfo = await getFilingInfo(filingInfo.defer);
    }

    return NextResponse.json({
      id: matched_id,
      name: gisData[matched_id].name,
      info: filingInfo
    });
  } catch (error) {
    return new NextResponse(null, { status: 500 });
  }
}
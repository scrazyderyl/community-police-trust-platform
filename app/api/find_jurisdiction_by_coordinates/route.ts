import { NextResponse } from "next/server";
import { promises as fs } from 'fs';
import { booleanPointInPolygon } from "@turf/turf";
import { db } from "@/firebaseConfig";
import { getAllGisData } from "@/lib/jurisdiction";

async function getJurisdictionName(id) {
  const index = await getAllGisData();
  return index[id].name;
}

async function getFilingInfo(id) {
  const infoRef = db.doc(`filing_info/${id}`);
  const infoSnap = await infoRef.get()

  return infoSnap.exists ? infoSnap.data() : null;
}

export async function GET(req) {
  // Get coordinates
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  if (!lat || !lon) {
    return new NextResponse(null, { status: 400 });
  }
  
  let point;

  try {
    point = [lon, lat];
  } catch (error) {
    return new NextResponse(null, { status: 400 });
  }

  // Find jurisdictions that contain the coordinate
  const geojson = JSON.parse(await fs.readFile(process.cwd() + '/lib/gis/AlleghenyCountyMunicipalBoundaries_6404275282653601599.geojson', 'utf8'));
  const intersections = geojson.features.filter(f => booleanPointInPolygon(point, f));

  if (intersections.length == 0) {
    return new NextResponse(null, { status: 404 });
  }
  
  // Use the first match for now
  const firstResult = intersections[0];
  const matched_id = firstResult.properties.JURISDICTION_ID;
  let filingInfo = await getFilingInfo(matched_id);
  
  // Resolve defer
  while (filingInfo && filingInfo.defer) {
    filingInfo = await getFilingInfo(filingInfo.defer);
  }

  let name = await getJurisdictionName(matched_id);

  return NextResponse.json({
    id: matched_id,
    name: name,
    info: filingInfo
  });
}
import { NextResponse } from "next/server";
import JURISDICTION_METADATA from "@/lib/jurisdiction_gis";
import { db } from "@/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

function getDefaultComplaintInfo() {
  return {
    last_updated: null,
    defer: null,
    methods: [],
    documents: [],
  }
}

export async function GET(req) {
  try {
    // Validate URL parameters
    const { searchParams } = new URL(req.url);
    const jurisdictionId = searchParams.get("id");

    if (!jurisdictionId) {
      return new NextResponse(null, { status: 400 });
    }

    // Check if the id exists
    const metadata = JURISDICTION_METADATA[jurisdictionId];

    if (!metadata) {
      return new NextResponse(null, { status: 404 });
    }

    // Query Firestore for complaints data
    let info;

    try {
      const docRef = doc(db, "jurisdiction_info", jurisdictionId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        info = docSnap.data();
      } else {
        info = getDefaultComplaintInfo();
      }
    } catch (error) {
      // Firestore error, probably not found
      info = getDefaultComplaintInfo();
    }

    if (info.defer) {
      info.defer = {
        value: info.defer,
        label: JURISDICTION_METADATA[info.defer].name
      }
    }

    return NextResponse.json({ info: info, metadata: metadata });
  } catch (error) {
    return new NextResponse(null, { status: 500 });
  }
}

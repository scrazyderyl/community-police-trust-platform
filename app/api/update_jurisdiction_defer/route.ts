import { NextResponse } from "next/server";
import { db } from "@/firebaseConfig";
import { doesJurisdictionExist } from "@/lib/jurisdiction";

export async function POST(req) {
  try {
    // Validate URL parameters
    const { searchParams } = new URL(req.url);
    const jurisdictionId = searchParams.get("id");

    if (!jurisdictionId) {
      return new NextResponse(null, { status: 400 });
    }

    // Check if jurisdictionId is valid
    if (!(await doesJurisdictionExist(jurisdictionId))) {
      return new NextResponse(null, { status: 404 }); 
    }
    
    // Get user submission
    let deferJurisdictionId;

    try {
      deferJurisdictionId = await req.json();
    } catch {
      return new NextResponse(null, { status: 400 });
    }
    
    // Ensure defer jurisdiction id is valid
    if (deferJurisdictionId != null && (!(await doesJurisdictionExist(deferJurisdictionId)) || jurisdictionId === deferJurisdictionId)) {
      return new NextResponse(null, { status: 400 });
    }

    // Move existing data to history
    let docRef = db.doc(`jurisdiction_info/${jurisdictionId}`);
    let docFound = false;

    try {
      const docSnap = await docRef.get();

      if (docSnap.exists) {
        const currentData = docSnap.data();
        const colRef = db.collection(`revisions/${jurisdictionId}/versions`);
        await colRef.add(currentData);
        docFound = true;
      }
    } catch (error) {
      // Assume not found
    }
  
    try {
      if (docFound) {
        // Update document
        await docRef.update({
          last_updated: new Date().toISOString(),
          defer: deferJurisdictionId
        });
      } else {
        // Create new doucment
        docRef.set({
          last_updated: new Date().toISOString(),
          defer: deferJurisdictionId,
          methods: [],
          documents: [],
        })
      }
      
      return new NextResponse(null, { status: 200 });
    } catch (error) {
      return new NextResponse(null, { status: 500 });
    }
  } catch (error) {
    return new NextResponse(null, { status: 500 });
  }
}
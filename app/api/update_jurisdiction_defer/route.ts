import { NextResponse } from "next/server";
import { db } from "@/firebaseConfig";
import { doc, getDoc, collection, addDoc, updateDoc, setDoc } from "firebase/firestore";
import { jurisidictionExists } from "@/services/JurisdictionGisService";

export async function POST(req) {
  try {
    // Validate URL parameters
    const { searchParams } = new URL(req.url);
    const jurisdictionId = searchParams.get("id");

    if (!jurisdictionId) {
      return new NextResponse(null, { status: 400 });
    }

    // Check if jurisdictionId is valid
    if (!(await jurisidictionExists(jurisdictionId))) {
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
    if (deferJurisdictionId != null && (!(await jurisidictionExists(deferJurisdictionId)) || jurisdictionId === deferJurisdictionId)) {
      return new NextResponse(null, { status: 400 });
    }

    // Move existing data to history
    let docRef;
    let docFound = false;

    try {
      docRef = doc(db, "jurisdiction_info", jurisdictionId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const currentData = docSnap.data();
        const colRef = collection(db, "revisions", jurisdictionId, "versions");
        await addDoc(colRef, currentData);
        docFound = true;
      }
    } catch (error) {
      // Assume not found
    }
  
    try {
      if (docFound) {
        // Update document
        await updateDoc(docRef, {
          last_updated: new Date().toISOString(),
          defer: deferJurisdictionId
        });
      } else {
        // Create new doucment
        await setDoc(docRef, {
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
import { NextResponse } from "next/server";
import JURISDICTION_METADATA from "@/lib/jurisdiction_gis";
import { VALIDATION_SCHEMA } from "@/lib/jurisdiction_info_schema";
import { db } from "@/firebaseConfig";
import { doc, getDoc, setDoc, collection, addDoc } from "firebase/firestore";

export async function POST(req) {
  try {
    // Validate URL parameters
    const { searchParams } = new URL(req.url);
    const jurisdictionId = searchParams.get("id");
  
    if (!jurisdictionId) {
      return new NextResponse(null, { status: 400 });
    }

    // Check if jurisdictionId exists
    if (!jurisdictionId in JURISDICTION_METADATA) {
      return new NextResponse(null, { status: 404 });
    }
  
    // Get user submission
    let data;

    try {
      data = await req.json();
    } catch {
      return new NextResponse(null, { status: 400 });
    }
  
    // Validate submission
    try {
      await VALIDATION_SCHEMA.validate(data);
    } catch (error) {
      return new NextResponse(null, { status: 400 });
    }

    // Additional check for defer field
    if (data.defer && !(data.defer.value in JURISDICTION_METADATA)) {
        return new NextResponse(null, { status: 400 });
    }
  
    // Process submission
    const cleanedDocuments = data.documents.map(({ verified, ...rest }) => rest);
    const newData = {
      ...data,
      documents: cleanedDocuments,
      last_updated: new Date().toISOString(),
    };

    // Move existing data to history
    try {
      const docRef = doc(db, "jurisdiction_info", jurisdictionId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const currentData = docSnap.data();
        const colRef = collection(db, "revisions", jurisdictionId, "versions");
        await addDoc(colRef, currentData);
      }
    } catch (error) {
      // Assume not found
    }
  
    // Update database
    try {
      const docRef = doc(db, "jurisdiction_info", jurisdictionId);
      await setDoc(docRef, newData);
      
      return new NextResponse(null, { status: 200 });
    } catch (error) {
      return new NextResponse(null, { status: 500 });
    }
  } catch (error) {
    console.log(error);
    return new NextResponse(null, { status: 500 });
  }
}
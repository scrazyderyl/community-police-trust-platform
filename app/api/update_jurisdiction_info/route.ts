import { NextResponse } from "next/server";
import { VALIDATION_SCHEMA } from "@/lib/jurisdiction_info_schema";
import { db } from "@/firebaseConfig";
import { doc, getDoc, setDoc, collection, addDoc } from "firebase/firestore";
import { jurisdictionExists } from "@/services/JurisdictionGisService";

function processData(data) {
  // Remove empty entries and strip entries of verified field
  let cleanedDocuments = [];

  for (let document of data.documents) {
    if (document.url) {
      cleanedDocuments.push({
        name: document.name.trim(),
        url: document.url.trim(),
      })
    }
  }

  data.documents = cleanedDocuments;

  for (let method of data.methods) {
    let cleanedValues = [];

    if (method.method === "online form") {
      for (let value of method.values) {
        if (value.value) {
          cleanedValues.push(value.value.trim());
        }
      }
    } else {
      for (let value of method.values) {
        if (value) {
          cleanedValues.push(value.trim());
        }
      }
    }

    method.values = cleanedValues;
  }

  data.last_updated = new Date().toISOString();
}

export async function POST(req) {
  try {
    // Validate URL parameters
    const { searchParams } = new URL(req.url);
    const jurisdictionId = searchParams.get("id");
  
    if (!jurisdictionId) {
      return new NextResponse(null, { status: 400 });
    }

    // Check if jurisdictionId exists
    if (!(await jurisdictionExists(jurisdictionId))) {
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
    if (data.defer != null && (!(await jurisdictionExists(data.defer.value)) || jurisdictionId === data.defer.value)) {
      return new NextResponse(null, { status: 400 });
    }
    
    // Process submission
    processData(data);

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
      await setDoc(docRef, data);
      
      return new NextResponse(null, { status: 200 });
    } catch (error) {
      return new NextResponse(null, { status: 500 });
    }
  } catch (error) {
    return new NextResponse(null, { status: 500 });
  }
}
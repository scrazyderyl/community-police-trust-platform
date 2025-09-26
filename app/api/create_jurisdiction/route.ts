import { db } from '@/firebaseConfig';
import { NextResponse } from "next/server";

async function addNewJurisdiction(id, name) {
  try {
    const docRef = db.doc("jurisdiction_gis/index");
    const docSnap = await docRef.get();
    
    if (!docSnap.exists) {
      return false;
    }

    const data = docSnap.data();

    // Don't overwrite if id exists
    if (id in data) {
      return false;
    }

    // Add to object
    data[id] = {
      name: name
    };

    // Add entry to Firebase
    await docRef.update({
      [id]: { name: name }
    });

    return true;
  } catch (error) {
    return false;
  }
}

export async function POST(req) {
  try {
    // Get user submission
    let name;

    try {
      name = await req.json();
    } catch {
      return new NextResponse(null, { status: 400 });
    }

    // Data validation
    if (typeof name !== "string") {
      return new NextResponse(null, { status: 400 });
    }

    name = name.trim();

    if (name === "") {
      return new NextResponse(null, { status: 400 });
    }
    
    // Automatically generate ID from name
    let id = name.toUpperCase().replaceAll(" ", "_");

    // Attempt to add the new jurisdiction
    if (await addNewJurisdiction(id, name)) {
      return NextResponse.json(id);
    } else {
      return new NextResponse(null, { status: 409 });
    }
  } catch (error) {
    return new NextResponse(null, { status: 500 });
  }
}
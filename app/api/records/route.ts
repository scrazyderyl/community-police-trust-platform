import { getDocs, collection } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { NextResponse } from "next/server";

const COLLECTION_NAME = "records";

export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
  
    const records = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(records);
  } catch (error) {
    return new NextResponse(null, { status: 500 });
  }
};

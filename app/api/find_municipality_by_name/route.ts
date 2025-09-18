import { db } from "@/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import { NextResponse } from "next/server";

export async function GET(req) {
  // Validate URL parameters
  const { searchParams } = new URL(req.url);
  const municipalityName = searchParams.get("q");

  if (typeof municipalityName !== "string") {
    return new NextResponse(null, { status: 400 });
  }

  try {
    // Reference to the municipality collection
    const municipalityRef = collection(db, "municipality");

    // Query to find documents where the "name" field contains the name
    // Firestore query for partial match (range query using Unicode boundary)
    const q = query(
      municipalityRef,
      where("id", ">=", municipalityName),
      where("id", "<=", municipalityName + "\uf8ff")
    );

    // Execute the query
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log(`No municipality found with id: ${municipalityName}`);
      return new NextResponse(null, { status: 404 });
    }

    // Process all matched results
    const result = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
      filing_info: doc.data().filing_info,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error finding municipality by address:", error);
    throw error;
  }
}
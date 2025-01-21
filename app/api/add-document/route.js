import { db } from "@/firebaseConfig";
import {
  collection,
  addDoc,
} from "firebase/firestore";

export async function POST(req) {
  try {
    const body = await req.json(); // Parse the request body
    const { filing_info, name, zipcode } = body;

    // Validate the input
    if (!filing_info || !name || !Array.isArray(zipcode)) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Invalid input. Please provide 'filing_info', 'name', and an array of 'zipcode'.",
        }),
        { status: 400 }
      );
    }

    const recordData = {
      filing_info,
      name,
      zipcode,
    };

    // Add the record to Firestore
    const docRef = await addDoc(collection(db, "municipality"), recordData);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Document added successfully",
        documentId: docRef.id,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error adding document:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Failed to add document",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}


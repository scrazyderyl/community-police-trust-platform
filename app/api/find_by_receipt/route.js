import { db } from "@/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

export async function POST(req) {
  try {
    const { receiptString } = await req.json();

    if (!receiptString) {
      return new Response(JSON.stringify({ error: "Receipt string is required" }), { status: 400 });
    }

    // Query Firestore for the record with the given receipt string
    const recordsRef = collection(db, "record");
    const q = query(recordsRef, where("receiptString", "==", receiptString));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return new Response(JSON.stringify({ error: "No record found with this receipt string" }), { status: 404 });
    }

    // Extract the first matching record
    let record = null;
    querySnapshot.forEach((doc) => {
      record = { id: doc.id, ...doc.data() };
    });

    return new Response(JSON.stringify({ message: "Record found", record }), { status: 200 });
  } catch (error) {
    console.error("Error fetching record:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}

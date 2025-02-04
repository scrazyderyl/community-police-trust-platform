import { db } from "@/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export async function POST(req) {
  try {
    const { id } = await req.json();

    if (!id) {
      return new Response(JSON.stringify({ error: "Record ID is required" }), { status: 400 });
    }

    const recordRef = doc(db, "record", id);
    const recordSnap = await getDoc(recordRef);

    if (!recordSnap.exists()) {
      return new Response(JSON.stringify({ error: "Record not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Record found", record: recordSnap.data() }), { status: 200 });
  } catch (error) {
    console.error("Error fetching record:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}

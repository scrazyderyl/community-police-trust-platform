import { db } from "@/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

export async function POST(req) {
  try {
    const { id, date, location, status, issue } = await req.json();

    if (!id || !date || !location || !status || !issue) {
      return new Response(JSON.stringify({ error: "All fields are required" }), { status: 400 });
    }

    const recordRef = doc(db, "records", id);

    await updateDoc(recordRef, {
      date,
      location,
      status,
      issue,
      updatedAt: new Date().toISOString(),
    });

    return new Response(JSON.stringify({ message: "Record updated successfully" }), { status: 200 });
  } catch (error) {
    console.error("Error updating record:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}

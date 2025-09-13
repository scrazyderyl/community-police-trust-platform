import { db } from "@/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

/* {This endpoint has been archived.}

export async function POST(req) {
  try {
    const { safeword } = await req.json();
    console.log(safeword);

    if (!safeword) {
      return new Response(JSON.stringify({ error: "Safeword is required" }), { status: 400 });
    }

    // Query Firestore for the record with the given receipt string
    const recordsRef = collection(db, "records");
    const q = query(recordsRef, where("safeword", "==", safeword));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return new Response(JSON.stringify({ error: "No record found with this safeword" }), { status: 404 });
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
*/
import { addRecord } from "@/services/FirestoreService";
import { sendReceiptEmail } from "@/services/emailService";

export async function POST(req) {
  try {
    const body = await req.json(); // Parse incoming JSON request
    if (!body.date || !body.location || !body.status || !body.issue || !body.email) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
    }

    // Generate a unique receipt string (for future record updates)
    const receiptString = Math.random().toString(36).substring(2, 10); 

    const record = {
      ...body,
      receiptString, // Store receipt string
      createdAt: new Date().toISOString(), // Optional timestamp
    };

    // Save to Firestore
    await addRecord(record);

    // send email to user
    await sendReceiptEmail(body.email, receiptString);

    return new Response(JSON.stringify({ message: "Record added successfully", receiptString }), { status: 201 });
  } catch (error) {
    console.error("Error adding record:", error);
    return new Response(JSON.stringify({ error: "Failed to add record" }), { status: 500 });
  }
}

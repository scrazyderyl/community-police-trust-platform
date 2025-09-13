import sendgrid from "@sendgrid/mail";

// Load SendGrid API Key from environment variables
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
const single_sender_email = process.env.SINGLE_SENDER_EMAIL;

export async function sendReceiptEmail(email, receiptString) {
  const msg = {
    to: email,
    from: single_sender_email, // Your verified sender email
    subject: "Your Complaint Record Receipt",
    text: `Thank you for submitting your complaint record. Your receipt string is: ${receiptString}. Keep it safe for future reference.`,
  };

  try {
    await sendgrid.send(msg);
    console.log(`Receipt email sent to ${email}`);
  } catch (error) {
    console.error("Error sending email:", error.response ? error.response.body : error);
    throw new Error("Failed to send receipt email.");
  }
}


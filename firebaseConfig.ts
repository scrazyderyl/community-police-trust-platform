import { apps, credential, auth as fbauth, firestore } from "firebase-admin";
import { initializeApp } from "firebase-admin/app";

// Initialize Firebase
const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_KEY);

if (!apps.length) {
  initializeApp({
    credential: credential.cert(serviceAccount)
  });
}

export const db = firestore();
export const auth = fbauth();
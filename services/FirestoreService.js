// services/firestoreService.js
import { db } from "@/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

// COLLECTION NAME (e.g., "users")
const COLLECTION_NAME = "records";

// CREATE: Add a Document
export const addRecord = async (recordData) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), recordData);
    console.log("Document written with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding document:", error);
  }
};

// READ: Get All Documents
export const getRecords = async () => {
  const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// UPDATE: Update a Document
export const updateRecord = async (id, updatedData) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  try {
    await updateDoc(docRef, updatedData);
    console.log("Document updated successfully");
  } catch (error) {
    console.error("Error updating document:", error);
  }
};

// DELETE: Delete a Document
export const deleteRecord = async (id) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  try {
    await deleteDoc(docRef);
    console.log("Document deleted successfully");
  } catch (error) {
    console.error("Error deleting document:", error);
  }
};

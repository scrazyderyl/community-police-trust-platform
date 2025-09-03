
/**
 * GeoService.js
 * Service for geographic and municipality-related operations
 */

import { db } from "@/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

export async function geocodeAddress(address) {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(address)}`);
    const data = await res.json();
    
    return data;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}

export async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&addressdetails=1`,);
    const data = await res.json();
    
    return data;
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return null;
  }
}

export async function findMunicipalityByAddress(municipalityName) {
  if (!municipalityName || typeof municipalityName !== "string") {
    return null;
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
      return null;
    }

    // Process all matched results
    const result = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
      filing_info: doc.data().filing_info,
    }));

    return result;
  } catch (error) {
    console.error("Error finding municipality by address:", error);
    throw error;
  }
}
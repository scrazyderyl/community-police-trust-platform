import { db } from "@/firebaseConfig";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

// Function to find municipality by zip code
export async function findMunicipalityByZipCode(zipCode) {
    try {
        // Extract only the first 5 digits of the zip code
        const shortZipCode = zipCode.slice(0, 5);

        // Reference to the municipality collection
        const municipalityRef = collection(db, "municipality");

        // Query to find the document containing the zip code
        const q = query(municipalityRef, where("zipcode", "array-contains", shortZipCode));

        // Execute the query
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.log("No municipality found with the provided zip code.");
            return null;
        }

        // There might be multiple matches, therefore, process all matches.
        const result = querySnapshot.docs.map((doc) => ({
            id: doc.id, // Optional: Include document ID if needed
            name: doc.data().name,
            filing_info: doc.data().filing_info,
        }));

        console.log(result);
        return result;
    } catch (error) {
        console.error("Error finding municipality:", error);
        throw error;
    }
}

// Function to find municipality by address (matches the first word of the municipality name)
export async function findMunicipalityByAddress(municipalityName) {
    try {
        if (!municipalityName || typeof municipalityName !== "string") {
            console.error("Invalid municipality name provided.");
            return null;
        }

        // Reference to the municipality collection
        const municipalityRef = collection(db, "municipality");

        // Query to find documents where the "name" field contains the first word
        // Firestore query for partial match (range query using Unicode boundary)
        const q = query(
            municipalityRef, 
            where("name", ">=", municipalityName), 
            where("name", "<=", municipalityName + "\uf8ff")
        );

        // Execute the query
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.log(`No municipality found.`);
            return null;
        }

        // Process all matched results
        const result = querySnapshot.docs.map((doc) => ({
            id: doc.id, // Optional: Include document ID
            name: doc.data().name,
            filing_info: doc.data().filing_info,
        }));

        console.log(result);
        return result;
    } catch (error) {
        console.error("Error finding municipality:", error);
        throw error;
    }
}


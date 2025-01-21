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

        // Assuming there might be multiple results, process the first match
        // const municipalityData = querySnapshot.docs[0].data();
        // const result = {
        //     name: municipalityData.name,
        //     filing_info: municipalityData.filing_info,
        // };
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

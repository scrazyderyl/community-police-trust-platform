
/**
 * GeoService.js
 * Service for geographic and municipality-related operations
 */

import { db } from "@/firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";

/**
 * Finds municipalities by zip code using Firestore
 * @param {string} zipCode - ZIP code to search for
 * @returns {Promise<Array>} - Array of municipalities
 */
export async function findMunicipalityByZipCode(zipCode) {
    if (!zipCode) {
        console.warn("No ZIP code provided to findMunicipalityByZipCode");
        return null;
    }

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
            id: doc.id, // Include document ID
            name: doc.data().name,
            filing_info: doc.data().filing_info,
        }));

        console.log("Found municipalities by zip code:", result);
        return result;
    } catch (error) {
        console.error("Error finding municipality by ZIP code:", error);
        throw error;
    }
}

/**
 * Finds municipalities by address using Firestore
 * @param {string} municipalityName - Address or city to search for
 * @returns {Promise<Array>} - Array of municipalities
 */
export async function findMunicipalityByAddress(municipalityName) {
    if (!municipalityName || typeof municipalityName !== "string") {
        console.warn("Invalid municipality name provided.");
        return null;
    }
    
    try {
        // Reference to the municipality collection
        const municipalityRef = collection(db, "municipality");

        // Query to find documents where the "name" field contains the name
        // Firestore query for partial match (range query using Unicode boundary)
        const q = query(
            municipalityRef, 
            where("name", ">=", municipalityName), 
            where("name", "<=", municipalityName + "\uf8ff")
        );

        // Execute the query
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.log(`No municipality found with name: ${municipalityName}`);
            return null;
        }

        // Process all matched results
        const result = querySnapshot.docs.map((doc) => ({
            id: doc.id, // Include document ID
            name: doc.data().name,
            filing_info: doc.data().filing_info,
        }));

        console.log("Found municipalities by address:", result);
        return result;
    } catch (error) {
        console.error("Error finding municipality by address:", error);
        throw error;
    }
}

/**
 * Performs direct GraphQL query to find municipality by address
 * @param {string} address - Address to search
 * @returns {Promise<Array>} - Array of municipalities
 */
export async function findMunicipalityByAddressGraphQL(address) {
    if (!address) {
        console.warn("No address provided for GraphQL query");
        return null;
    }

    try {
        const graphqlQuery = {
            query: `
                query ($address: String!) {
                    findMunicipalityByAddress(address: $address) {
                        id
                        name
                        filing_info
                    }
                }
            `,
            variables: {
                address: address,
            },
        };

        const response = await fetch("/api/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(graphqlQuery),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.errors) {
            console.error("GraphQL Error:", data.errors);
            throw new Error(data.errors[0].message);
        }
        
        return data.data.findMunicipalityByAddress;
    } catch (error) {
        console.error("Error in GraphQL query:", error);
        throw error;
    }
}
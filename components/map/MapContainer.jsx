"use client";
import React, { useEffect, useState, useRef } from "react";
import Script from "next/script";
import { geocodeAddress, reverseGeocode, findMunicipalityByAddress } from "@/services/GeoService";

import SearchSection from "./SearchSection";
import InfoModal from "./InfoModal";

const MapContainer = () => {
  const [map, setMap] = useState(null);
  const mapRef = useRef(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [showInfoCard, setShowInfoCard] = useState(false);

  // Show info for coordinates
  const showInfoForCoordinates = async (lat, lng, mapInstance) => {
    try {
      const data = await reverseGeocode(lat, lng);

      if (!data) {
        console.error("Reverse geocoding failed");
        return;
      }

      const results = await findMunicipalityByAddress(
        data.address.town || data.address.neighbourhood || data.address.village
      );

      // Generate filing info HTML
      let filingInfo;

      if (results && results.length > 0) {
        filingInfo = results
          .map((result) => `<strong>${result.name}:</strong> ${result.filing_info}`)
          .join("<br/>");
      } else {
        filingInfo = "No Record Found";
      }

      // Generate popup content
      const locationInfo = `
        <div style="width: 250px; max-width: 400px; white-space: normal;">
          <strong>Location Details</strong><br/>
          ${data.display_name || "Address not found"}<br/>
          <strong>ZIP Code:</strong> ${data.address.postcode || "N/A"}<br/>
          <div style="margin-top: 8px"><strong>Nearby Municipalities:</strong></div>
          <div style="max-height: 100px; overflow-y: auto; border: 1px solid #ccc; padding: 5px; margin-top: 5px;">
            ${filingInfo}
          </div>
        </div>
      `;

      // Show popup on the map
      if (mapRef.current && window.L && mapInstance) {
        window.L.popup({ maxWidth: 400 })
          .setLatLng([lat, lng])
          .setContent(locationInfo)
          .openOn(mapInstance);
      }
    } catch (error) {
      console.error("Error fetching info by coordinates:", error);
    }
  };

  // Initialize the map
  useEffect(() => {
    if (typeof window !== "undefined" && window.L && mapRef.current && !isMapReady) {
      const L = window.L;

      const map = L.map(mapRef.current, {
        center: [40.4406, -79.9959],
        zoom: 10,
      }).addLayer(
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        })
      );

      setMap(map);

      // Click handler
      map.on("click", async (e) => {
        const { lat, lng } = e.latlng;
        showInfoForCoordinates(lat, lng, map);
      });

      setIsMapReady(true);
    }
  }, [isMapReady]);

  const handleSearch = async (query) => {
    query = query.trim();
    if (!query) {
      alert("Please enter a valid address.");
      return;
    }
    // Use fetchSuggestions and wait for its results
    let suggestions;
    try {
      suggestions = await fetchSuggestions(query);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      alert("Error occurred during address search.");
      return;
    }
    if (suggestions && suggestions.length > 0) {
      const { position } = suggestions[0];
      map.setView([position.lat, position.lng], 14);
      showInfoForCoordinates(position.lat, position.lng, map);
    } else {
      alert("No results found for the entered address.");
    }
  };

  const fetchSuggestions = async (query) => {
    query = query.trim();

    if (!query) {
      return [];
    }

    const results = await geocodeAddress(query);

    if (results) {
      return results
        .filter(item => item.lat && item.lon)
        .slice(0, 5)
        .map(item => ({
          label: item.display_name,
          position: { lat: parseFloat(item.lat), lng: parseFloat(item.lon) },
        }));
    }

    return [];
  };

  // Locate the current user
  const locateUser = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    if (!isMapReady) {
      alert("Map is not fully initialized. Please try again in a moment.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // Move map to current position and show info
        map.setView([latitude, longitude], 10);
        showInfoForCoordinates(latitude, longitude, map);
      },
      (error) => {
        alert("Unable to retrieve your location. Please check location permissions.");
        console.error("Geolocation error:", error);
      }
    );
  };

  return (
    <>
      {/* Load Leaflet */}
      <Script
        src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        strategy="beforeInteractive"
        onLoad={() => console.log("Leaflet loaded")}
      />
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />

      {/* Search Controls */}
      <div className="w-full flex justify-center">
        <div className="w-3/4 flex justify-center items-center space-x-4">
          <SearchSection
            onSearch={handleSearch}
            onSuggestionsFetch={fetchSuggestions}
            onLocateClick={locateUser}
            onInfoClick={() => setShowInfoCard(true)}
          />
        </div>

        {/* Information Modal */}
        {showInfoCard && <InfoModal onClose={() => setShowInfoCard(false)} />}
      </div>
      <div
        id="map_container"
        className="flex justify-center h-[60vh] min-h-[400px] w-full flex-shrink-0 mt-8"
      >
        {/* Map */}
        <div
          ref={mapRef}
          id="map"
          className="w-[90vw] h-full rounded-lg shadow-lg"
        ></div>

        {/* Loading Overlay */}
        {!isMapReady && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-gray-50"
          >
            <div className="w-3/4 max-w-md p-6 bg-white border border-gray-300 rounded-lg shadow-lg text-center">
              <h2 className="text-lg font-semibold text-gray-800">
                Map Loading...
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                Please wait while the map initializes.
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MapContainer;

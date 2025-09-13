"use client";
import React, { useCallback, useRef, useState, useEffect } from "react";
import { MapContainer, TileLayer, Popup, useMap, useMapEvents } from "react-leaflet";
import { Map as LeafletMapType } from "leaflet";
import "leaflet/dist/leaflet.css";

import { geocodeAddress, reverseGeocode, findMunicipalityByAddress } from "@/services/GeoService";
import SearchSection from "./SearchSection";
import InfoModal from "./InfoModal";

type SelectedLocation = {
  lat: number;
  lng: number;
  content: React.ReactNode;
};

// Helper component to store the map instance in a ref
const SetMapRef: React.FC<{ mapRef: React.RefObject<LeafletMapType> }> = ({ mapRef }) => {
  const map = useMap();

  useEffect(() => {
    mapRef.current = map;
  }, [map, mapRef]);

  return null;
};

// Separate component for handling map clicks
const MapClickHandler: React.FC<{ onClick: (lat: number, lng: number) => void }> = ({ onClick }) => {
  useMapEvents({
    click(e) {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

function MapViewer() {
  const mapRef = useRef<LeafletMapType | null>(null);
  const suggestionCacheRef = useRef<{ lat: number; lng: number }[]>([]);

  const [selected, setSelected] = useState<SelectedLocation | null>(null);
  const [showInfoCard, setShowInfoCard] = useState(false);

  const showInfoForCoordinates = useCallback(
    async (lat: number, lng: number, recenter: boolean) => {
      setSelected({
        lat,
        lng,
        content: <div className="w-64">Loading...</div>,
      });

      if (recenter && mapRef.current) {
        mapRef.current.setView([lat, lng], 14);
      }

      try {
        const data = await reverseGeocode(lat, lng);

        if (!data) {
          setSelected({
            lat,
            lng,
            content: <div className="w-64">Address not found</div>,
          });
          return;
        }

        const municipalityName =
          data.address.town || data.address.neighbourhood || data.address.village || "";

        const results = municipalityName
          ? await findMunicipalityByAddress(municipalityName)
          : [];

        const filingInfoNode =
          results && results.length > 0 ? (
            <div>
              {results.map((r, i) => (
                <div key={i}>
                  <strong>{r.name}:</strong> {r.filing_info}
                </div>
              ))}
            </div>
          ) : (
            <div>No Record Found</div>
          );

        const contentNode = (
          <div className="w-64 max-w-[400px] whitespace-normal">
            <strong>Location Details</strong>
            <br />
            {data.display_name || "Address not found"}
            <br />
            <strong>ZIP Code:</strong> {data.address.postcode || "N/A"}
            <div className="mt-2">
              <strong>Nearby Municipalities:</strong>
            </div>
            <div className="max-h-24 overflow-y-auto border border-gray-300 p-1 mt-1">
              {filingInfoNode}
            </div>
          </div>
        );

        setSelected({
          lat,
          lng,
          content: contentNode,
        });
      } catch (err) {
        console.error("Error fetching info by coordinates:", err);

        setSelected({
          lat,
          lng,
          content: <div className="w-64">Error fetching data</div>,
        });
      }
    },
    []
  );

  const fetchSuggestions = async (query: string) => {
    query = query.trim();

    if (!query) {
      return [];
    }

    const results = await geocodeAddress(query);

    if (results) {
      const suggestions = results.slice(0, 5).map((item) => ({
        label: item.display_name,
        position: { lat: parseFloat(item.lat), lng: parseFloat(item.lon) },
      }));

      suggestionCacheRef.current = suggestions.map((s) => s.position);

      return suggestions;
    }

    suggestionCacheRef.current = [];
    return [];
  };

  const handleSearch = useCallback(
    async (query: string) => {
      const trimmed = query.trim();

      if (!trimmed) {
        alert("Please enter a valid address.");
        return;
      }

      let suggestions;

      try {
        suggestions = await fetchSuggestions(trimmed);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        alert("Error occurred during address search.");
        return;
      }

      if (suggestions && suggestions.length > 0) {
        const { lat, lng } = suggestions[0].position;

        setSelected({
          lat,
          lng,
          content: <div className="w-64">Loading...</div>,
        });

        if (mapRef.current) {
          mapRef.current.setView([lat, lng], 14);
        }

        showInfoForCoordinates(lat, lng, false);
      } else {
        alert("No results found for the entered address.");
      }
    },
    [showInfoForCoordinates]
  );

  const locateUser = useCallback(() => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        setSelected({
          lat: latitude,
          lng: longitude,
          content: <div className="w-64">Loading...</div>,
        });

        if (mapRef.current) {
          mapRef.current.setView([latitude, longitude], 14);
        }

        showInfoForCoordinates(latitude, longitude, false);
      },
      (error) => {
        alert("Unable to retrieve your location. Please check location permissions.");
        console.error("Geolocation error:", error);
      }
    );
  }, [showInfoForCoordinates]);

  return (
    <>
      <div className="w-full flex justify-center">
        <div className="w-3/4 flex justify-center items-center space-x-4">
          <SearchSection
            onSearch={handleSearch}
            onSuggestionsFetch={fetchSuggestions}
            onLocateClick={locateUser}
            onInfoClick={() => setShowInfoCard(true)}
          />
        </div>

        {showInfoCard && <InfoModal onClose={() => setShowInfoCard(false)} />}
      </div>

      <div className="flex justify-center h-[60vh] min-h-[400px] w-full flex-shrink-0 mt-8">
        <MapContainer
          center={[40.4406, -79.9959]}
          zoom={10}
          className="w-[90vw] h-full rounded-lg"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          <SetMapRef mapRef={mapRef} />

          <MapClickHandler onClick={(lat, lng) => showInfoForCoordinates(lat, lng, false)} />

          {selected && (
            <Popup position={[selected.lat, selected.lng]} closeOnClick={false} autoClose={false}>
              {selected.content}
            </Popup>
          )}
        </MapContainer>
      </div>
    </>
  );
}

export default MapViewer;

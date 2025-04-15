"use client";
import React, { useState } from "react";
import MapContainer from "@/components/map/MapContainer";
import SearchSection from "@/components/map/SearchSection";
import InfoModal from "@/components/map/InfoModal";
import DescriptionSection from "@/components/map/DescriptionSection";
import { useHereMaps } from "@/hooks/useHereMaps";

const HomePage = () => {
  const [showInfoCard, setShowInfoCard] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Create a single instance of the useHereMaps hook for the entire page
  const {
    mapRef,
    isMapReady,
    handleSearch,
    locateUser,
    fetchSuggestions,
    handleScriptLoad,
  } = useHereMaps();

  return (
    <div className="flex flex-col h-screen items-center">
      {/* Description Section */}
      <DescriptionSection expanded={expanded} setExpanded={setExpanded} />

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

      {/* Map Container - pass all the necessary props from the hook */}
      <MapContainer
        mapRef={mapRef}
        isMapReady={isMapReady}
        handleScriptLoad={handleScriptLoad}
      />
    </div>
  );
};

export default HomePage;

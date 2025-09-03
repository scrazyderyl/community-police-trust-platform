// page.jsx
"use client";
import React, { useState } from "react";
import MapContainer from "@/components/map/MapContainer";
import DescriptionSection from "@/components/map/DescriptionSection";

const HomePage = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex flex-col h-screen items-center">
      {/* Description Section */}
      <DescriptionSection expanded={expanded} setExpanded={setExpanded} />

      {/* Map */}
      <MapContainer />
    </div>
  );
};

export default HomePage;

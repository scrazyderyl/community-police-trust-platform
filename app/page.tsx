// page.tsx
"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";

const MapViewer = dynamic(
  () => import("@/components/map/MapViewer"),
  { ssr: false }
);

import DescriptionSection from "@/components/map/DescriptionSection";

const HomePage = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex flex-col h-screen items-center">
      {/* Description Section */}
      <DescriptionSection expanded={expanded} setExpanded={setExpanded} />

      {/* Map */}
      <MapViewer />
    </div>
  );
};

export default HomePage;

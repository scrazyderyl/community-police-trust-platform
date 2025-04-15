"use client";
import React, { useEffect } from "react";
import Script from "next/script";

const MapContainer = ({ mapRef, isMapReady, handleScriptLoad }) => {
  // This component should only receive the mapRef and handlers from the hook
  // It shouldn't create a new instance of the hook

  return (
    <>
      {/* Load HERE Maps Scripts */}
      <Script
        src="https://js.api.here.com/v3/3.1/mapsjs-core.js"
        strategy="beforeInteractive"
        onLoad={() => {
          console.log("Core script loaded");
          handleScriptLoad("core");
        }}
      />
      <Script
        src="https://js.api.here.com/v3/3.1/mapsjs-service.js"
        strategy="beforeInteractive"
        onLoad={() => {
          console.log("Service script loaded");
          handleScriptLoad("service");
        }}
      />
      <Script
        src="https://js.api.here.com/v3/3.1/mapsjs-ui.js"
        strategy="beforeInteractive"
        onLoad={() => {
          console.log("UI script loaded");
          handleScriptLoad("ui");
        }}
      />
      <Script
        src="https://js.api.here.com/v3/3.1/mapsjs-mapevents.js"
        strategy="beforeInteractive"
        onLoad={() => {
          console.log("Events script loaded");
          handleScriptLoad("events");
        }}
      />
      <link
        rel="stylesheet"
        href="https://js.api.here.com/v3/3.1/mapsjs-ui.css"
      />

      <div
        id="map_container"
        className="flex justify-center w-full mt-8"
        style={{ height: "60vh", minHeight: "400px", flexShrink: 0 }}
      >
        <div
          ref={mapRef}
          id="map"
          className="w-[90vw] h-full rounded-lg shadow-lg"
        ></div>

        {!isMapReady && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-gray-50"
            style={{ zIndex: 10 }}
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

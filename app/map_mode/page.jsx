"use client";
import React, { useEffect, useRef, useState } from "react";
import Script from "next/script";

const Map_mode = () => {
  const mapRef = useRef(null);
  const [isClient, setIsClient] = useState(false);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const [scriptsLoaded2, setScriptsLoaded2] = useState(false);
  const [scriptsLoaded3, setScriptsLoaded3] = useState(false);
  const [scriptsLoaded4, setScriptsLoaded4] = useState(false);

  const api_key = process.env.NEXT_PUBLIC_HERE_MAPS_API_KEY;

  useEffect(() => {
    setIsClient(true);

    if (!scriptsLoaded || !scriptsLoaded2 || !scriptsLoaded3 || !scriptsLoaded4 || typeof H === "undefined" || !mapRef.current) return;
    
    const platform = new H.service.Platform({
      apikey: api_key,  // Replace with your API key
    });

    const defaultLayers = platform.createDefaultLayers();

    try {
      const map = new H.Map(
        mapRef.current,
        defaultLayers.vector.normal.map,
        {
          center: { lat: 40.444611, lng: -79.952108 },
          zoom: 14,
        }
      );

      new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
      H.ui.UI.createDefault(map, defaultLayers);

      setTimeout(() => {
        map.getViewPort().resize();
      }, 100);

      console.log("Map initialized successfully");
    } catch (error) {
      console.error("Map initialization error:", error);
    }
  }, [isClient, scriptsLoaded]);

  return (
    <div className="flex justify-center h-screen">
      {/* Load HERE Maps Scripts */}
      <Script
        src="https://js.api.here.com/v3/3.1/mapsjs-core.js"
        strategy="afterInteractive"
        onLoad={() => setScriptsLoaded(true)}
      />
      <Script
        src="https://js.api.here.com/v3/3.1/mapsjs-service.js"
        strategy="afterInteractive"
        onLoad={() => setScriptsLoaded2(true)}
      />
      <Script
        src="https://js.api.here.com/v3/3.1/mapsjs-ui.js"
        strategy="afterInteractive"
        onLoad={() => setScriptsLoaded3(true)}
      />
      <Script
        src="https://js.api.here.com/v3/3.1/mapsjs-mapevents.js"
        strategy="afterInteractive"
        onLoad={() => setScriptsLoaded4(true)}
      />

      <link
        rel="stylesheet"
        href="https://js.api.here.com/v3/3.1/mapsjs-ui.css"
      />
      <div id="map_container" className="flex justify-center mt-10">
        {isClient && (
          <div
            ref={mapRef}
            id="map"
            style={{
              width: "80vw",  // Adjust width to fit screen
              height: "500px", // Set height
            }}
          ></div>
        )}
      </div>
    </div>
  );
};

export default Map_mode;








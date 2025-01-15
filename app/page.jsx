"use client";
import React, { useEffect, useRef, useState } from "react";
import Script from "next/script";
import Search_bar from "@/components/Search_bar"


// Home Page Component
const Home = () => {
  const platformRef = useRef(null);
  const [isClient, setIsClient] = useState(false);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const [scriptsLoaded2, setScriptsLoaded2] = useState(false);
  const [scriptsLoaded3, setScriptsLoaded3] = useState(false);
  const [scriptsLoaded4, setScriptsLoaded4] = useState(false);
  const [locationInfo, setLocationInfo] = useState(null);
  const api_key = process.env.NEXT_PUBLIC_HERE_MAPS_API_KEY;

  useEffect(() => {
    setIsClient(true);
    
    let retryCount = 0;
    const maxRetries = 20;  // Retry for 20 intervals (4 seconds total)
    // set up intervals to ensure the scripts are loaded.
    const interval = setInterval(()=>{
      if (
        scriptsLoaded &&
        scriptsLoaded2 &&
        scriptsLoaded3 &&
        scriptsLoaded4 &&
        typeof H !== "undefined"
      ){
        clearInterval(interval);

        const platform = new H.service.Platform({
          apikey: api_key,
        });
        platformRef.current = platform;
    
      }else{
        retryCount++;
      if (retryCount > maxRetries) {
        clearInterval(interval);  // Stop retrying after max retries
        console.error("Map initialization failed after multiple attempts");
      }
      }
    }, 250)
  
    return () => clearInterval(interval);
  }, [isClient, scriptsLoaded, scriptsLoaded2, scriptsLoaded3, scriptsLoaded4]);

    // Geocode Address: Get coordinates from user input
    function geocodeAddress(platform, query, callback) {
      const geocoder = platform.getSearchService();
      geocoder.geocode(
        {
          q: query,
        },
        (result) => {
          if (result.items && result.items.length > 0) {
            const location = result.items[0].position;
            const locationInfo = result.items[0].address;
            callback(null, location, locationInfo);
          } else {
            callback("Location not found", null);
          }
        },
        (error) => {
          console.error("Geocoding failed:", error);
          callback("Error retrieving location", null);
        }
      );
    }

      // Handle Address Search
  function handleSearch(inputVal) {
    const query = inputVal.trim();
    if (query) {
      geocodeAddress(platformRef.current, query, (error, location, locationInfo) => {
        if (error) {
          alert(error);
        } else {
        console.log(locationInfo);
        setLocationInfo(locationInfo);
        }
      });
    } else {
      alert("Please enter a valid address.");
    }
  }



  return (
    <div>
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
    <section className="w-full flex-center flex-col">
      <h1 className="head_text text-center">
        Search Complaint Information
      </h1>
      <div>
        {/* Pass show_map_btn as a boolean */}
        <Search_bar show_map_btn={true} onSearch={(value) => {
                console.log("Search Value:", value);
                // Add logic to handle the search value here
                handleSearch(value);
              }}/>
      </div>
      {/* Display Location Info Block */}
      {locationInfo && (
        <div className="flex justify-center mt-5">
  <div className="w-2/4 mt-5 p-6 bg-white rounded-lg shadow-md border border-gray-200">
    <h2 className="text-xl font-semibold text-gray-800 mb-2">Location Information</h2>
    <p className="text-gray-600">
      <strong>Address:</strong> {locationInfo.label || "N/A"}
    </p>
    <p className="text-gray-600">
      <strong>ZIP Code:</strong> {locationInfo.postalCode || "N/A"}
    </p>
  </div>
  </div>
)}
    </section>
    </div>
  )
}

export default Home


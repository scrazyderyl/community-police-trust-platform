"use client";
import React, { useEffect, useRef, useState } from "react";
import Script from "next/script";
import Search_bar from "@/components/Search_bar";
import {
  findMunicipalityByZipCode,
  findMunicipalityByAddress,
} from "@/services/GeoService";

const Map_mode = () => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const uiRef = useRef(null);
  const platformRef = useRef(null);

  const [isClient, setIsClient] = useState(false);
  const [scriptsLoaded, setScriptsLoaded] = useState(false);
  const [scriptsLoaded2, setScriptsLoaded2] = useState(false);
  const [scriptsLoaded3, setScriptsLoaded3] = useState(false);
  const [scriptsLoaded4, setScriptsLoaded4] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const [showInfoCard, setShowInfoCard] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [muni, setMuni] = useState("");

  const [bubble, setBubble] = useState(null);

  const api_key = process.env.NEXT_PUBLIC_HERE_MAPS_API_KEY;

  useEffect(() => {
    setIsClient(true);

    let retryCount = 0;
    const maxRetries = 50; // Retry for 50 intervals (total: 5 seconds)
    const intervalDelay = 100; // Interval delay in milliseconds

    const interval = setInterval(() => {
      if (
        scriptsLoaded &&
        scriptsLoaded2 &&
        scriptsLoaded3 &&
        scriptsLoaded4 &&
        typeof H !== "undefined" &&
        mapRef.current
      ) {
        clearInterval(interval);

        const platform = new H.service.Platform({
          apikey: api_key,
        });
        platformRef.current = platform;

        const defaultLayers = platform.createDefaultLayers();

        const map = new H.Map(mapRef.current, defaultLayers.vector.normal.map, {
          center: { lat: 40.444611, lng: -79.952108 },
          zoom: 10,
        });

        mapInstance.current = map;

        const behavior = new H.mapevents.Behavior(
          new H.mapevents.MapEvents(map)
        );
        const ui = H.ui.UI.createDefault(map, defaultLayers);
        uiRef.current = ui;

        setTimeout(() => {
          map.getViewPort().resize();
        }, 100);

        console.log("Map initialized successfully");
        setIsMapReady(true);

        // Add event listener for map click
        map.addEventListener("tap", (evt) => {
          const coord = map.screenToGeo(
            evt.currentPointer.viewportX,
            evt.currentPointer.viewportY
          );

          showAddressBubble(coord);
        });

        return;
      }

      retryCount++;
      if (retryCount > maxRetries) {
        clearInterval(interval);
        console.error("Failed to initialize HERE Maps after multiple retries");
      }
    }, intervalDelay);

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [isClient, scriptsLoaded, scriptsLoaded2, scriptsLoaded3, scriptsLoaded4]);

  // Function to locate the current location of the user.
  const locateUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          mapInstance.current.setCenter(userCoords);
          mapInstance.current.setZoom(14);

          // Remove any existing bubbles
          if (bubble) {
            uiRef.current.removeBubble(bubble);
          }

          // Initialize HERE Maps SearchService
          const searchService = platformRef.current.getSearchService();

          // Perform Reverse Geocoding
          searchService.reverseGeocode(
            {
              at: `${userCoords.lat},${userCoords.lng}`,
            },
            (result) => {
              if (result.items.length > 0) {
                const location = result.items[0].address;
                findMunicipalityByAddress(location.city)
                  .then((results) => {
                    if (results) {
                      let filingInfo = "";

                      if (results && results.length > 0) {
                        // Generate filing information for each result
                        filingInfo = results
                          .map(
                            (result) =>
                              `<strong>${result.name}:</strong> ${result.filing_info}`
                          )
                          .join("<br/>");
                      } else {
                        filingInfo = "No Record Found";
                      }
                      const locationInfo = `
                <div style="width: 250px; max-width: 400px; white-space: normal;">
                  <strong>Location Details</strong><br/>
                  ${location.label || "Address not found"}<br/>
                  <strong>ZIP Code:</strong> ${
                    location.postalCode || "N/A"
                  }<br/>
                  <div style="margin-top: 8px"><strong>Nearby Municialities:</strong></div>
                  <div style="max-height: 100px; overflow-y: auto; border: 1px solid #ccc; padding: 5px; margin-top: 5px;">
                      ${filingInfo}
                  </div>
                </div>
              `;

                      // Create and show info bubble with location data
                      const newBubble = new H.ui.InfoBubble(userCoords, {
                        content: locationInfo,
                      });
                      setBubble(newBubble);
                      uiRef.current.addBubble(newBubble);
                    } else {
                      const locationInfo = `
                              <div style="width: 250px; max-width: 400px; white-space: normal;">
                                <strong>Location Details</strong><br/>
                                ${location.label || "Address not found"}<br/>
                                <strong>ZIP Code:</strong> ${
                                  location.postalCode || "N/A"
                                }<br/>
                                <strong>Filing Information:</strong> No Record Found
                              </div>
                            `;

                      // Create and show info bubble with location data
                      const newBubble = new H.ui.InfoBubble(userCoords, {
                        content: locationInfo,
                      });
                      setBubble(newBubble);
                      uiRef.current.addBubble(newBubble);
                    }
                  })
                  .catch((error) => console.error(error));
              } else {
                alert("Address not found for this location.");
              }
            },
            (error) => {
              console.error("Reverse geocoding failed:", error);
              alert("Failed to retrieve location details.");
            }
          );
        },
        (error) => {
          alert(
            "Unable to retrieve your location. Please check location permissions."
          );
          console.error("Geolocation error:", error);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  // Show the information of a location when the user clicks.
  const showAddressBubble = (coords) => {
    const searchService = platformRef.current.getSearchService();

    searchService.reverseGeocode(
      {
        at: `${coords.lat},${coords.lng}`,
      },
      (result) => {
        if (result.items.length > 0) {
          const location = result.items[0].address;
          console.log(location.city);

          findMunicipalityByAddress(location.city)
            .then((results) => {
              if (results) {
                let filingInfo = "";

                if (results && results.length > 0) {
                  // Generate filing information for each result
                  filingInfo = results
                    .map(
                      (result) =>
                        `<strong>${result.name}:</strong> ${result.filing_info}`
                    )
                    .join("<br/>");
                } else {
                  filingInfo = "No Record Found";
                }
                const locationInfo = `
                    <div style="width: 250px; max-width: 400px; white-space: normal;">
                      <strong>Location Details</strong><br/>
                      ${location.label || "Address not found"}<br/>
                      <strong>ZIP Code:</strong> ${
                        location.postalCode || "N/A"
                      }<br/>
                      <div style="margin-top: 8px"><strong>Nearby Municialities:</strong></div>
                      <div style="max-height: 100px; overflow-y: auto; border: 1px solid #ccc; padding: 5px; margin-top: 1px;">
                        ${filingInfo}
                      </div> 
                    </div>
                  `;
                const bubbles = uiRef.current.getBubbles();
                bubbles.forEach((b) => uiRef.current.removeBubble(b));

                // Create and add a new bubble
                const newBubble = new H.ui.InfoBubble(coords, {
                  content: locationInfo,
                });
                setBubble(newBubble);
                uiRef.current.addBubble(newBubble);
              } else {
                console.log("No municipality found.");
                const locationInfo = `
                    <div style="width: 250px; max-width: 400px; white-space: normal;">
                      <strong>Location Details</strong><br/>
                      ${location.label || "Address not found"}<br/>
                      <strong>ZIP Code:</strong> ${
                        location.postalCode || "N/A"
                      }<br/>
                      <strong>Filing Information:</strong> No Record Found
                    </div>
                  `;

                const bubbles = uiRef.current.getBubbles();
                bubbles.forEach((b) => uiRef.current.removeBubble(b));

                // Create and add a new bubble
                const newBubble = new H.ui.InfoBubble(coords, {
                  content: locationInfo,
                });
                setBubble(newBubble);
                uiRef.current.addBubble(newBubble);
              }
            })
            .catch((error) => console.error(error));
        } else {
          alert("No address found at this location.");
        }
      },
      (error) => {
        console.error("Reverse geocoding failed:", error);
        alert("Failed to retrieve address.");
      }
    );
  };

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
      geocodeAddress(
        platformRef.current,
        query,
        (error, location, locationInfo) => {
          if (error) {
            alert(error);
          } else {
            const pos = location;
            findMunicipalityByAddress(locationInfo.city)
              .then((results) => {
                if (results) {
                  let filingInfo = "";

                  if (results && results.length > 0) {
                    // Generate filing information for each result
                    filingInfo = results
                      .map(
                        (result) =>
                          `<strong>${result.name}:</strong> ${result.filing_info}`
                      )
                      .join("<br/>");
                  } else {
                    filingInfo = "No Record Found";
                  }
                  const divInfo = `
                        <div style="width: 250px; max-width: 400px; white-space: normal;">
                          <strong>Location Details</strong><br/>
                          ${locationInfo.label || "Address not found"}<br/>
                          <strong>ZIP Code:</strong> ${
                            locationInfo.postalCode || "N/A"
                          }<br/>
                          <div style="margin-top: 8px"><strong>Nearby Municialities:</strong></div>
                          <div style="max-height: 100px; overflow-y: auto; border: 1px solid #ccc; padding: 5px; margin-top: 5px;">
    ${filingInfo}
  </div>
                        </div>
                      `;
                  console.log(pos);
                  const userCoords = {
                    lat: pos.lat,
                    lng: pos.lng,
                  };
                  mapInstance.current.setCenter(pos);
                  // Remove all existing bubbles
                  const bubbles = uiRef.current.getBubbles();
                  bubbles.forEach((b) => uiRef.current.removeBubble(b));

                  // Create and add a new bubble
                  const newBubble = new H.ui.InfoBubble(userCoords, {
                    content: divInfo,
                  });
                  setBubble(newBubble);
                  uiRef.current.addBubble(newBubble);
                } else {
                  console.log("No municipality found.");
                }
              })
              .catch((error) => console.error(error));
            const divInfo = `
                        <div style="width: 250px; max-width: 400px; white-space: normal;">
                          <strong>Location Details</strong><br/>
                          ${locationInfo.label || "Address not found"}<br/>
                          <strong>ZIP Code:</strong> ${
                            locationInfo.postalCode || "N/A"
                          }<br/>
                          <strong>Filing Information:</strong> No Record Found
                        </div>
                      `;
            console.log(pos);
            const userCoords = {
              lat: pos.lat,
              lng: pos.lng,
            };
            mapInstance.current.setCenter(pos);
            // Remove all existing bubbles
            const bubbles = uiRef.current.getBubbles();
            bubbles.forEach((b) => uiRef.current.removeBubble(b));

            // Create and add a new bubble
            const newBubble = new H.ui.InfoBubble(userCoords, {
              content: divInfo,
            });
            setBubble(newBubble);
            uiRef.current.addBubble(newBubble);
          }
        }
      );
    } else {
      alert("Please enter a valid address.");
    }
  }

  // auto suggestion
  const fetchSuggestions = (query) => {
    if (!query) return Promise.resolve([]);

    const searchService = platformRef.current.getSearchService();

    return new Promise((resolve, reject) => {
      searchService.autosuggest(
        {
          q: query,
          at: "40.444611,-79.952108", // Example coordinates, adjust as needed
          limit: 5, // Limit the number of suggestions
        },
        (result) => {
          if (result.items) {
            const suggestions = result.items
              .filter((item) => item.position) // Ensure the suggestion has a position
              .map((item) => ({
                label: item.title,
                position: item.position,
              }));
            resolve(suggestions);
          } else {
            resolve([]);
          }
        },
        (error) => {
          console.error("Autosuggest failed:", error);
          reject(error);
        }
      );
    });
  };

  // get municipality currently not using
  async function getMunicipality(address) {
    const apiKey = process.env.NEXT_PUBLIC_HERE_MAPS_API_KEY;
    const url = `https://geocode.search.hereapi.com/v1/geocode?q=${encodeURIComponent(
      address
    )}&apiKey=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.items.length > 0) {
        const municipality = data.items[0].address.city; // Extract municipality
        console.log("Municipality:", municipality);
        setMuni(municipality);
        return municipality;
      } else {
        console.log("No results found.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching municipality:", error);
    }
  }

  return (
    <div className="flex flex-col h-screen items-center">
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
      <div className="w-3/4 hidden lg:block text-center bg-gray-200 p-5 text-black-500 text-sm leading-relaxed rounded-md mt-3">
        This website aimed at building trust and improving communication between
        community members and our law enforcement system in Allegheny County. We
        have gathered data on how to file police complaints across all
        municipalities using public records, direct inquiries, and Right to Know
        requests. This information is now available in the interactive map
        below. You can search for details by location or click ‘Locate Me’ to
        find complaint procedures specific to your area.
      </div>
      <div className="w-3/4 lg:hidden bg-gray-300 p-3 text-black text-sm leading-relaxed rounded-lg mt-3 text-left">
        <div>
          This website aims to build trust and improve communication
          {expanded && (
            <p>
              between community members and our law enforcement system in
              Allegheny County. We have gathered data on how to file police
              complaints across all municipalities using public records, direct
              inquiries, and Right to Know requests. This information is now
              available in the interactive map below. You can search for details
              by location or click ‘Locate Me’ to find complaint procedures
              specific to your area.
            </p>
          )}
          {!expanded && "..."}{" "}
          <span
            className="text-blue-600 cursor-pointer underline"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "read less" : "read more"}
          </span>
        </div>
      </div>
      {/* Full-width Search Bar */}
      <div className="w-full flex justify-center">
        <div className="w-3/4 flex justify-center items-center space-x-4">
          {/* Flex row & spacing */}
          <Search_bar
            show_map_btn={false}
            onSearch={(value) => {
              console.log("Search Value:", value);
              handleSearch(value);
            }}
            onSuggestionsFetch={(query) =>
              fetchSuggestions(query).then((suggestions) => {
                console.log("Suggestions:", suggestions);
                return suggestions;
              })
            }
          />
          <button
            className="btn_md mt-5 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 
             w-[120px] h-[40px] text-xs md:w-auto md:h-auto md:text-base"
            onClick={locateUser}
          >
            Locate Me
          </button>

          {/* "?" Button */}
          <button
            className="bg-blue-500 text-white mt-5 rounded-full flex items-center justify-center 
             w-7 h-7 min-w-7 min-h-7 text-lg font-bold text-gray-700 hover:bg-gray-400"
            onClick={() => setShowInfoCard(true)}
          >
            ?
          </button>
        </div>

        {/* Introduction Card */}
        {showInfoCard && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-3/4 max-w-md p-6 bg-white border border-gray-300 rounded-lg shadow-lg text-center">
            <h2 className="text-lg font-semibold text-gray-800">
              About This Website
            </h2>
            <p className="text-sm text-gray-600 mt-2">
              This website allows users to search for locations, view complaint
              information, and track status updates for reported issues.
            </p>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              onClick={() => setShowInfoCard(false)}
            >
              Close
            </button>
          </div>
        )}
      </div>

      <div
        id="map_container"
        className="flex justify-center w-full mt-8"
        style={{ height: "60vh", minHeight: "400px", flexShrink: 0 }} // Adjust based on header/search height
      >
        {isClient && (
          <div
            ref={mapRef}
            id="map"
            className="w-[90vw] h-full rounded-lg shadow-lg"
          ></div>
        )}
        {!isMapReady && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-gray-50"
            style={{
              zIndex: 10, // Ensure it's above other content
            }}
          >
            <div className="w-3/4 max-w-md p-6 bg-white border border-gray-300 rounded-lg shadow-lg text-center">
              <h2 className="text-lg font-semibold text-gray-800">
                Map Not Loaded
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                Please refresh the page to try again.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Map_mode;

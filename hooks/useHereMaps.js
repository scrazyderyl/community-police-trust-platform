"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { findMunicipalityByAddress } from "@/services/GeoService";

// Create a module-level variable to track if scripts are already loaded
let scriptsLoadedGlobally = false;

export function useHereMaps() {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const uiRef = useRef(null);
  const platformRef = useRef(null);
  const [bubble, setBubble] = useState(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [scriptsLoaded, setScriptsLoaded] = useState({
    core: false,
    service: false,
    ui: false,
    events: false
  });

  const api_key = process.env.NEXT_PUBLIC_HERE_MAPS_API_KEY;

  // Set client-side rendering flag
  useEffect(() => {
    setIsClient(true);
    
    // Check if we already have H loaded in the window
    if (typeof window !== 'undefined' && window.H) {
      setScriptsLoaded({
        core: true,
        service: true,
        ui: true,
        events: true
      });
    }
  }, []);

  // Script loading handler - use useCallback to ensure stable function reference
  const handleScriptLoad = useCallback((scriptName) => {
    console.log(`Script loaded: ${scriptName}`);
    setScriptsLoaded(prev => {
      const newState = { ...prev, [scriptName]: true };
      console.log("Updated scripts state:", newState);
      return newState;
    });
    
    // Also set the global flag to prevent duplicate initialization
    if (scriptName === 'events') {
      scriptsLoadedGlobally = true;
    }
  }, []);

  // Initialize map when all scripts are loaded
  useEffect(() => {
    if (!isClient) return;
    
    let isMounted = true;
    let retryCount = 0;
    const maxRetries = 50;
    const intervalDelay = 100;

    // Log the current state for debugging
    console.log("Script loading state:", scriptsLoaded);

    const interval = setInterval(() => {
      if (!isMounted) return;
      
      // Check if all scripts are loaded
      const allScriptsLoaded = 
        scriptsLoaded.core && 
        scriptsLoaded.service && 
        scriptsLoaded.ui && 
        scriptsLoaded.events;
      
      console.log("All scripts loaded check:", allScriptsLoaded, "H exists:", typeof window !== 'undefined' && typeof window.H !== 'undefined');
      
      if (allScriptsLoaded && typeof window !== 'undefined' && typeof window.H !== 'undefined' && mapRef.current) {
        clearInterval(interval);
        console.log("All conditions met, initializing map");
        initializeMap();
        return;
      }

      retryCount++;
      if (retryCount > maxRetries) {
        clearInterval(interval);
        console.error("Failed to initialize HERE Maps after multiple retries", {
          scriptsLoaded,
          haveMapsAPI: typeof window !== 'undefined' && typeof window.H !== 'undefined',
          haveMapRef: !!mapRef.current
        });
      }
    }, intervalDelay);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [isClient, scriptsLoaded]);

  
  // Initialize the map
  const initializeMap = () => {
    try {
      console.log("Initializing map with API key:", api_key ? "API key exists" : "No API key");
      
      // Initialize HERE Maps platform
      const platform = new window.H.service.Platform({ apikey: api_key });
      platformRef.current = platform;

      const defaultLayers = platform.createDefaultLayers();
      
      // Create map instance
      const map = new window.H.Map(
        mapRef.current, 
        defaultLayers.vector.normal.map, 
        {
          center: { lat: 40.444611, lng: -79.952108 }, // Pittsburgh area
          zoom: 10,
          pixelRatio: window.devicePixelRatio || 1
        }
      );

      mapInstance.current = map;

      // Initialize map behavior and UI
      new window.H.mapevents.Behavior(new window.H.mapevents.MapEvents(map));
      const ui = window.H.ui.UI.createDefault(map, defaultLayers);
      uiRef.current = ui;

      // Add click event listener for map tap
      map.addEventListener("tap", handleMapTap);

      // Resize viewport to ensure proper rendering
      setTimeout(() => map.getViewPort().resize(), 100);
      
      setIsMapReady(true);
      console.log("Map initialized successfully");
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  };

  const handleMapTap = (evt) => {
    if (!mapInstance.current) return;
    
    const coord = mapInstance.current.screenToGeo(
      evt.currentPointer.viewportX,
      evt.currentPointer.viewportY
    );
    
    showAddressBubble(coord);
  };

  // Create and show info bubble with location data
  const showInfoBubble = (coords, location, results) => {
    if (!uiRef.current) return;
    
    let filingInfo = "No Record Found";

    if (results && results.length > 0) {
      filingInfo = results
        .map(result => `<strong>${result.name}:</strong> ${result.filing_info}`)
        .join("<br/>");
    }

    const locationInfo = `
      <div style="width: 250px; max-width: 400px; white-space: normal;">
        <strong>Location Details</strong><br/>
        ${location.label || "Address not found"}<br/>
        <strong>ZIP Code:</strong> ${location.postalCode || "N/A"}<br/>
        <div style="margin-top: 8px"><strong>Nearby Municipalities:</strong></div>
        <div style="max-height: 100px; overflow-y: auto; border: 1px solid #ccc; padding: 5px; margin-top: 5px;">
          ${filingInfo}
        </div>
      </div>
    `;

    // Remove existing bubbles
    const bubbles = uiRef.current.getBubbles();
    bubbles.forEach(b => uiRef.current.removeBubble(b));

    // Create and show new info bubble
    const newBubble = new window.H.ui.InfoBubble(coords, {
      content: locationInfo,
    });

    setBubble(newBubble);
    uiRef.current.addBubble(newBubble);
  };

  // Show info when the user clicks on the map
  const showAddressBubble = (coords) => {
    if (!platformRef.current) return;
    
    const searchService = platformRef.current.getSearchService();
    searchService.reverseGeocode(
      { at: `${coords.lat},${coords.lng}` },
      (result) => {
        if (result.items.length > 0) {
          const location = result.items[0].address;
          
          findMunicipalityByAddress(location.city)
            .then(results => {
              showInfoBubble(coords, location, results);
            })
            .catch(error => {
              console.error("Error finding municipality:", error);
              showInfoBubble(coords, location, null);
            });
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

  // Locate the current user
  const locateUser = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    if (!mapInstance.current || !platformRef.current || !uiRef.current) {
      alert("Map is not fully initialized. Please try again in a moment.");
      return;
    }

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

        // Perform Reverse Geocoding
        const searchService = platformRef.current.getSearchService();
        searchService.reverseGeocode(
          { at: `${userCoords.lat},${userCoords.lng}` },
          (result) => {
            if (result.items.length > 0) {
              const location = result.items[0].address;
              
              findMunicipalityByAddress(location.city)
                .then(results => {
                  showInfoBubble(userCoords, location, results);
                })
                .catch(error => {
                  console.error("Error finding municipality:", error);
                  showInfoBubble(userCoords, location, null);
                });
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
        alert("Unable to retrieve your location. Please check location permissions.");
        console.error("Geolocation error:", error);
      }
    );
  };

  // Geocode Address: Get coordinates from user input
  function geocodeAddress(query, callback) {
    if (!platformRef.current) {
      callback("Map is not initialized", null);
      return;
    }
    
    const geocoder = platformRef.current.getSearchService();
    geocoder.geocode(
      { q: query },
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

  // Handle search input
  const handleSearch = (inputVal) => {
    const query = inputVal.trim();
    if (!query) {
      alert("Please enter a valid address.");
      return;
    }

    geocodeAddress(query, (error, location, locationInfo) => {
      if (error) {
        alert(error);
        return;
      }
      
      // Successfully geocoded, now search for municipality
      findMunicipalityByAddress(locationInfo.city)
        .then(results => {
          // Set map center to search location
          if (mapInstance.current) {
            mapInstance.current.setCenter(location);
            mapInstance.current.setZoom(14);
          }
          
          // Show info bubble with location data
          showInfoBubble(location, locationInfo, results);
        })
        .catch(error => {
          console.error("GraphQL Error:", error);
          showInfoBubble(location, locationInfo, null);
        });
    });
  };

  // Fetch address suggestions for autocomplete
  const fetchSuggestions = (query) => {
    if (!query || !platformRef.current) return Promise.resolve([]);

    const searchService = platformRef.current.getSearchService();

    return new Promise((resolve, reject) => {
      searchService.autosuggest(
        {
          q: query,
          at: "40.444611,-79.952108", // Pittsburgh area
          limit: 5, // Limit the number of suggestions
        },
        (result) => {
          if (result.items) {
            const suggestions = result.items
              .filter(item => item.position) // Ensure the suggestion has a position
              .map(item => ({
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

  return {
    mapRef,
    isMapReady,
    handleSearch,
    locateUser,
    fetchSuggestions,
    handleScriptLoad,
    scriptsLoaded
  };
}
export async function geocodeAddress(address) {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(address)}`);
    const data = await res.json();
    
    return data;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}

export async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&addressdetails=1`,);
    const data = await res.json();
    
    return data;
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return null;
  }
}

export async function findMunicipalityByName(municipalityName) {
  if (typeof municipalityName !== "string") {
    return null;
  }

  try {
    const res = await fetch(`/api/find_municipality_by_name?q=${encodeURIComponent(municipalityName)}`);
    const data = await res.json();

    return data;
  } catch (error) {
    return null;
  }
}
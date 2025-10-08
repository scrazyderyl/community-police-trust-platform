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
    console.log(data);

    return data;
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return null;
  }
}

export async function findJurisdictionByAddress(address) {
  try {
    const res = await fetch("/api/find_jurisdiction_by_address", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(address),
    });
    const data = await res.json();

    return data;
  } catch (error) {
    return null;
  }
}
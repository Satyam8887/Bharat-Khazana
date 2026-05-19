// src/helper/geoDistanceHelper.js

function toRad(value) {
  return (value * Math.PI) / 180;
}

// Safely extract a coordinate value — handles 0 correctly (0 is a valid coordinate)
function extractCoord(obj, ...keys) {
  for (const key of keys) {
    const val = obj?.[key];
    if (val !== undefined && val !== null && !isNaN(val)) return parseFloat(val);
  }
  return null;
}

const distanceCalculater = (shopLoc, userLoc) => {
  if (!shopLoc || !userLoc) return null;

  // User location
  const lat1 = extractCoord(userLoc, "lat", "latitude");
  const lon1 = extractCoord(userLoc, "lng", "longitude");

  // Shop location — Firestore GeoPoint exposes .latitude / .longitude
  // Some SDKs also store as { lat, lng } or { _latitude, _longitude }
  const lat2 = extractCoord(shopLoc, "latitude", "lat", "_latitude");
  const lon2 = extractCoord(shopLoc, "longitude", "lng", "_longitude");

  if (lat1 === null || lon1 === null || lat2 === null || lon2 === null) {
    console.warn("distanceCalculater: missing coordinates", { shopLoc, userLoc });
    return null;
  }

  // Haversine Formula (R = 6371 km)
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;

  if (d < 1) return (d * 1000).toFixed(0) + " m";   // e.g. "800 m"
  return d.toFixed(1) + " km";                        // e.g. "5.2 km"
};

export default distanceCalculater;
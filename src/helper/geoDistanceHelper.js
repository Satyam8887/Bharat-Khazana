
// src/helper/geoDistanceHelper.js

function toRad(Value) {
  return (Value * Math.PI) / 180;
}

const distanceCalculater = (shopLoc, userLoc) => {
  if (!shopLoc || !userLoc) return null;

  // 1. Coordinates extract karo (Safety check ke sath)
  // Kabhi kabhi firebase 'lat' deta hai, kabhi 'latitude'
  const lat1 = userLoc.lat || userLoc.latitude;
  const lon1 = userLoc.lng || userLoc.longitude;
  
  const lat2 = shopLoc.lat || shopLoc.latitude || shopLoc._lat; // Firestore GeoPoint handling
  const lon2 = shopLoc.lng || shopLoc.longitude || shopLoc._long;

  if (!lat1 || !lon1 || !lat2 || !lon2) return null;

  // 2. Haversine Formula (Earth Radius R = 6371 km)
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

  // 3. Formatting: Agar distance 1 km se kam hai to meters me dikhao
  if (d < 1) {
    return (d * 1000).toFixed(0) + " m"; // e.g. "500 m"
  }
  
  return d.toFixed(1) + " km"; // e.g. "5.2 km"
};

export default distanceCalculater;
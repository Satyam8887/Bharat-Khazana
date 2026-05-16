import { useState } from "react";

function useLocation() {
  const [coords, setCoords] = useState({ latitude: null, longitude: null });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const requestLocationPermission = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Update state
        setCoords({ latitude, longitude });
        setError(null);
        setLoading(false);

        // To see the values immediately, log the variables directly, 
        // not the state variables.
        console.log("Location captured:", latitude, longitude);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

  return { 
    requestLocationPermission, 
    latitude: coords.latitude, 
    longitude: coords.longitude, 
    error, 
    loading 
  };
}

export default useLocation;
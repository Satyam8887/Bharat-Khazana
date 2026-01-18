import { useState } from "react";

function useLocation() {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [locationPermission, setLocationPermission] = useState(false);

  const requestLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          setLatitude(lat);
          setLongitude(lng);
          setLocationPermission(true);
        //   console.log("baby got the location",latitude,longitude);
        },
        (error) => {
          console.error('Error getting user location:', error);
          setLocationPermission(false);
        }
      );
    } else {
      console.error('Geolocation is not supported by your browser.');
      setLocationPermission(false);
    }
  };

  return { requestLocationPermission, latitude, longitude, locationPermission };
}

export default useLocation;

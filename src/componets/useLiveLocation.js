import { useState } from "react";

export default function useLiveLocation() {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [error, setError] = useState(null);

  const startLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude.toFixed(6));
        setLongitude(pos.coords.longitude.toFixed(6));
        setError(null);
      },
      (err) => setError(err.message),
      { enableHighAccuracy: true }
    );
  };


  return { latitude, longitude, error, startLocation };
}

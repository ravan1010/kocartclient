// hooks/useLocation.js
import { useState, useEffect } from "react";

const useLocation = () => {
  const [location, setLocation] = useState(null);
  const [locaError, setError] = useState(null);
  const [Loadingloc, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude.toFixed(6),
          lng: position.coords.longitude.toFixed(6),
        });
        setLoading(false);
      },
      (err) => {
        setError("Location permission denied");
        setLoading(false);
        console.log(err);
      }
    );
  }, []);

  return { location, locaError, Loadingloc };
};

export default useLocation;
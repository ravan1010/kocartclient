import { useState, useEffect } from "react";

const useLocation = () => {
  const [location, setLocation] = useState(null);
  const [locaError, setError] = useState(null);
  const [Loadingloc, setLoading] = useState(true);

  const turnON = () => {
    setLoading(true);

    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: Number(position.coords.latitude.toFixed(6)),
          lng: Number(position.coords.longitude.toFixed(6)),
        });

        setError(null);
        setLoading(false);
      },
      (err) => {
        console.log(err);
        setError("Location permission denied");
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    turnON();
  }, []);

  return { location, locaError, Loadingloc, turnON };
};

export default useLocation;
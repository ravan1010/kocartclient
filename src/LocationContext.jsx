import { useState, useEffect } from "react";

const useLocation = () => {
  const [location, setLocation] = useState(null);
  const [locaError, setError] = useState(null);
  const [Loadingloc, setLoading] = useState(true);

  const turnON = async () => {
    setLoading(true);

    if (!navigator.geolocation) {
      setError("Geolocation not supported"); 
      setLoading(false);
      return;
    }


  const permission = await navigator.permissions.query({ name: "geolocation" });

  if (permission.state === "denied") {
    setError("Location blocked. Please enable it in browser settings.");
    setLoading(false)
    return;
  } ;
  

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
import { useCallback, useState } from "react";
import api from "../api";

export default function useChangeLocation() {
  const [locaError, setError] = useState(null);
  const [Loadingloc, setLoading] = useState(false);

  const ChangeLocation = useCallback(async () => {
    setLoading(true);

    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      setLoading(false);
      return;
    }

    const permission = await navigator.permissions.query({
      name: "geolocation",
    });

    if (permission.state === "denied") {
      setError("Location blocked. Please enable it in browser settings.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          await api.put(
            "/api/user/location",
            {
              latitude: position.coords.latitude.toFixed(6),
              longitude: position.coords.longitude.toFixed(6),
            },
            {
              withCredentials: true,
            }
          );

          setError(null);
        } catch (err) {
          console.log(err);
          setError("Failed to update location.");
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.log(err);
        setError(err.message);
        setLoading(false);
      }
    );
  }, []);

  return { locaError, Loadingloc, ChangeLocation };
}
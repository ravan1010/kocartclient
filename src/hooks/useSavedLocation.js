import { useEffect, useState } from "react";
import api from "../api";

const useSavedLocation = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSavedLocation = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await api.get("/api/client/location");

        if (!res.data?.success) {
          throw new Error(
            res.data?.message || "Location not found"
          );
        }

        const latitude = Number(
          res.data.location?.latitude
        );

        const longitude = Number(
          res.data.location?.longitude
        );

        if (
          !Number.isFinite(latitude) ||
          !Number.isFinite(longitude)
        ) {
          throw new Error("Invalid saved location");
        }

        setLocation({
          latitude,
          longitude,
        });
      } catch (err) {
        console.error(
          "Failed to load saved location:",
          err
        );

        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadSavedLocation();
  }, []);

  return {
    location,
    loading,
    error,
  };
};

export default useSavedLocation;
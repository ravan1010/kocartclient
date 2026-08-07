import { useEffect, useState } from "react";
import api from "../api";

const useMapLocation = (initialLocation = null) => {
  const [location, setLocation] = useState(
    initialLocation || {
      latitude: 12.2958,
      longitude: 76.6394,
    }
  );

  useEffect(() => {
  const loadSavedLocation = async () => {
    try {
      const res = await api.get("/api/client/location");

      if (!res.data.success) return;

      const { latitude, longitude } = res.data.location;

      if (!latitude || !longitude) return;

      setLocation({latitude, longitude})
     
    } catch (error) {
      console.log("Failed to load saved location", error);
    }
  };

  loadSavedLocation();
}, []);

  const [address, setAddress] = useState("");

  // Sync GPS/form location with map
  useEffect(() => {
    if (!initialLocation) return;

    const latitude = Number(initialLocation.latitude);
    const longitude = Number(initialLocation.longitude);

    if(
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)){
      return;
    }
    else{
      setLocation({
      latitude,
      longitude,
    });
    }

    
  }, [
    initialLocation?.latitude,
    initialLocation?.longitude,
  ]);

  const updateLocation = (latitude, longitude) => {
    setLocation({
      latitude: Number(latitude),
      longitude: Number(longitude),
    });
  };

  const reverseGeocode = async (latitude, longitude) => {
    try {
      const apiKey = import.meta.env.VITE_GEOAPIFY_KEY;

      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${apiKey}`
      );

      const data = await response.json();

      const result = data.features?.[0];

      if (result) {
        setAddress(
          result.properties.formatted || ""
        );
      }
    } catch (error) {
      console.error(
        "Reverse geocoding error:",
        error
      );
    }
  };

  return {
    location,
    address,
    updateLocation,
    reverseGeocode,
  };
};

export default useMapLocation;
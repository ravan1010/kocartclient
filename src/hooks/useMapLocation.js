import { useEffect, useState } from "react";

const DEFAULT_LOCATION = {
  latitude: 12.2958,
  longitude: 76.6394,
};

const useMapLocation = (initialLocation = null) => {
  const [location, setLocation] = useState(
    initialLocation || DEFAULT_LOCATION
  );

  const [address, setAddress] = useState("");

  // ------------------------------------
  // Sync GPS / parent location with map
  // ------------------------------------

  useEffect(() => {
    if (
      initialLocation?.latitude != null &&
      initialLocation?.longitude != null
    ) {
      setLocation({
        latitude: Number(initialLocation.latitude),
        longitude: Number(initialLocation.longitude),
      });
    }
  }, [
    initialLocation?.latitude,
    initialLocation?.longitude,
  ]);

  // ------------------------------------
  // User moves map
  // ------------------------------------

  const updateLocation = (latitude, longitude) => {
    setLocation({
      latitude: Number(latitude),
      longitude: Number(longitude),
    });
  };

  // ------------------------------------
  // Reverse geocoding
  // ------------------------------------

  const reverseGeocode = async (latitude, longitude) => {
    try {
      const apiKey = import.meta.env.VITE_GEOAPIFY_KEY || "9101d57bd3a34d2194bb8222a55a6a3f";

      if (!apiKey) {
        console.error("Geoapify API key missing");
        return;
      }

      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${apiKey}`
      );

      if (!response.ok) {
        throw new Error("Reverse geocoding failed");
      }

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
import { useState } from "react";

const useMapLocation = (initialLocation = null) => {
  const [location, setLocation] = useState(
    initialLocation || {
      latitude: 12.2958,
      longitude: 76.6394,
    }
  );

  const [address, setAddress] = useState("");

  const updateLocation = (latitude, longitude) => {
    setLocation({
      latitude,
      longitude,
    });
  };

  const reverseGeocode = async (latitude, longitude) => {
    try {
      const apiKey = import.meta.env.VITE_GEOAPIFY_KEY || "9101d57bd3a34d2194bb8222a55a6a3f";

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
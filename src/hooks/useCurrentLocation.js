import { useState } from "react";

const useCurrentLocation = () => {
  const [loading, setLoading] = useState(false);

  const getCurrentLocation = async () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(
          new Error("Geolocation is not supported")
        );
        return;
      }

      setLoading(true);

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const latitude =
              position.coords.latitude;

            const longitude =
              position.coords.longitude;

            const apiKey =
              import.meta.env.VITE_GEOAPIFY_KEY || "9101d57bd3a34d2194bb8222a55a6a3f" ;

            const response = await fetch(
              `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${apiKey}`
            );

            const data = await response.json();

            const address =
              data.features?.[0]?.properties
                ?.formatted || "Current Location";

            resolve({
              latitude,
              longitude,
              address,
            });
          } catch (error) {
            reject(error);
          } finally {
            setLoading(false);
          }
        },

        (error) => {
          setLoading(false);
          reject(error);
        },

        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  };

  return {
    getCurrentLocation,
    loading,
  };
};

export default useCurrentLocation;
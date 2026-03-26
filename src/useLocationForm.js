import { useState } from "react";
import axios from "axios";
import api from "./api";

export default function useLiveLocation() {

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [city, setCity] = useState("");
  const [distance, setDistance] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState("");

  const getLiveLocation = () => {

    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {

        const lat = pos.coords.latitude.toFixed(6);
        const lon = pos.coords.longitude.toFixed(6);

        try {

          const geo = await axios.get(
            "https://api.geoapify.com/v1/geocode/reverse",
            {
              params: {
                lat,
                lon,
                format: "json",
                apiKey: import.meta.env.VITE_GEOAPIFY_KEY
              }
            }
          );

          const cityName = geo;
          setCity(cityName);

          const res = await api.post(
            "/api/delivery-fee",
            { latitude: lat, longitude: lon },
            { withCredentials: true }
          );

          setLatitude(lat);
          setLongitude(lon);
          setDistance(res.data.totalDistance);

        } catch (err) {
          setError("Failed to fetch location");
        } finally {
          setLocationLoading(false);
        }

      },
      (err) => {
        setError(err.message);
        setLocationLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  return {
    latitude,
    longitude,
    city,
    distance,
    locationLoading,
    error,
    getLiveLocation
  };
}
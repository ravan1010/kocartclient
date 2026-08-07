import React, { useEffect } from "react";

import {
  MapContainer,
  TileLayer,
  useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import useMapLocation from "./useMapLocation";
import MapCenterUpdater from "./MapCenterUpdater";

const RecenterMap = ({ location }) => {
  const map = useMap();

  useEffect(() => {
    if (!location) return;

    map.setView(
      [
        location.latitude,
        location.longitude,
      ],
      map.getZoom()
    );
  }, [location, map]);

  return null;
};

const LocationPicker = ({
  type = "pickup",
  initialLocation,
  onConfirm,
}) => {
  const {
    location,
    address,
    updateLocation,
    reverseGeocode,
  } = useMapLocation(initialLocation);

  useEffect(() => {
    if (!location) return;

    reverseGeocode(
      location.latitude,
      location.longitude
    );
  }, [
    location?.latitude,
    location?.longitude,
  ]);

  const handleLocationChange = (
    latitude,
    longitude
  ) => {
    updateLocation(
      latitude,
      longitude
    );
  };

  const handleConfirm = () => {
    onConfirm({
      type,
      latitude: location.latitude,
      longitude: location.longitude,
      address,
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto">

      {/* Header */}

      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800">
          {type === "pickup"
            ? "Select Pickup Location"
            : "Select Drop Location"}
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Move the map to select your location
        </p>
      </div>


      {/* Map */}

      <div className="relative w-full h-[450px] rounded-2xl overflow-hidden border">

        <MapContainer
          center={[
            location.latitude,
            location.longitude,
          ]}
          zoom={15}
          scrollWheelZoom={true}
          className="w-full h-full"
        >

          <TileLayer
            url={`https://maps.geoapify.com/v1/tile/osm-bright-smooth/{z}/{x}/{y}.png?apiKey=${import.meta.env.VITE_GEOAPIFY_KEY}`}
            attribution="© OpenStreetMap contributors"
          />

          <MapCenterUpdater
            onLocationChange={
              handleLocationChange
            }
          />

          <RecenterMap
            location={location}
          />

        </MapContainer>


        {/* Fixed center marker */}

        <div
          className="
            absolute
            top-1/2
            left-1/2
            -translate-x-1/2
            -translate-y-full
            z-[1000]
            pointer-events-none
          "
        >
          <div className="text-4xl">
            📍
          </div>
        </div>

      </div>


      {/* Address */}

      <div className="mt-4 bg-gray-50 rounded-xl p-4">

        <p className="text-xs text-gray-500">
          Selected location
        </p>

        <p className="font-medium text-gray-800 mt-1">
          {address || "Finding address..."}
        </p>

        <div className="text-xs text-gray-500 mt-2">
          {location.latitude.toFixed(6)},{" "}
          {location.longitude.toFixed(6)}
        </div>

      </div>


      {/* Confirm */}

      <button
        onClick={handleConfirm}
        className="
          mt-4
          w-full
          bg-indigo-600
          hover:bg-indigo-700
          text-white
          py-3
          rounded-xl
          font-semibold
          transition
        "
      >
        Confirm{" "}
        {type === "pickup"
          ? "Pickup"
          : "Drop"}{" "}
        Location
      </button>

    </div>
  );
};

export default LocationPicker;
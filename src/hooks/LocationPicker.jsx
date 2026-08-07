
import React, { useEffect } from "react";

import {
  MapContainer,
  TileLayer,
  useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import useMapLocation from "./useMapLocation";
import MapCenterUpdater from "./MapCenterUpdater";

/*
|--------------------------------------------------------------------------
| Recenter map when location changes
|--------------------------------------------------------------------------
*/

const RecenterMap = ({ location }) => {
  const map = useMap();

  useEffect(() => {
    if (!location) return;

    const lat = Number(location.latitude);
    const lng = Number(location.longitude);

    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lng)
    ) {
      return;
    }

    map.setView(
      [lat, lng],
      17,
      {
        animate: true,
      }
    );
  }, [
    location?.latitude,
    location?.longitude,
    map,
  ]);

  return null;
};


/*
|--------------------------------------------------------------------------
| LocationPicker
|--------------------------------------------------------------------------
*/

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


  /*
  |--------------------------------------------------------------------------
  | Reverse geocode whenever location changes
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!location) return;

    reverseGeocode(
      Number(location.latitude),
      Number(location.longitude)
    );
  }, [
    location?.latitude,
    location?.longitude,
  ]);


  /*
  |--------------------------------------------------------------------------
  | Map center changed by user
  |--------------------------------------------------------------------------
  */

  const handleLocationChange = (
    latitude,
    longitude
  ) => {
    updateLocation(
      latitude,
      longitude
    );
  };


  /*
  |--------------------------------------------------------------------------
  | Confirm location
  |--------------------------------------------------------------------------
  */

  const handleConfirm = () => {

    if (!location) {
      alert("Please select a location");
      return;
    }

    onConfirm({
      type,

      latitude: Number(
        location.latitude
      ),

      longitude: Number(
        location.longitude
      ),

      address,
    });
  };


  /*
  |--------------------------------------------------------------------------
  | Map
  |--------------------------------------------------------------------------
  */

  if (!location) {
    return (
      <div className="w-full h-[450px] rounded-2xl bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">
          Loading map...
        </p>
      </div>
    );
  }


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

      <div
        className="
          relative
          w-full
          h-[450px]
          rounded-2xl
          overflow-hidden
          border
        "
      >

        <MapContainer
          center={[
            Number(location.latitude),
            Number(location.longitude),
          ]}
          zoom={15}
          scrollWheelZoom={true}
          className="w-full h-full"
        >

          <TileLayer
            url={`https://maps.geoapify.com/v1/tile/osm-bright-smooth/{z}/{x}/{y}.png?apiKey=${import.meta.env.VITE_GEOAPIFY_KEY}`}
            attribution="© OpenStreetMap contributors"
          />

          {/* 
            User moves map
            ↓
            MapCenterUpdater
            ↓
            updateLocation()
          */}

          <MapCenterUpdater
            onLocationChange={
              handleLocationChange
            }
          />


          {/*
            GPS button changes location
            ↓
            useMapLocation gets new location
            ↓
            RecenterMap moves Leaflet map
          */}

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


      {/* Selected Address */}

      {/* <div className="mt-4 bg-gray-50 rounded-xl p-4">

        <p className="text-xs text-gray-500">
          Selected location
        </p>

        <p className="font-medium text-gray-800 mt-1">
          {address || "Finding address..."}
        </p>

        <div className="text-xs text-gray-500 mt-2">

          {Number(location.latitude).toFixed(6)}
          {", "}
          {Number(location.longitude).toFixed(6)}

        </div>

      </div> */}


      {/* Confirm */}

      <button
        type="button"
        onClick={handleConfirm}
        className="
          mt-4
          w-full
          bg-indigo-600
          hover:bg-indigo-700
          active:scale-[0.99]
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


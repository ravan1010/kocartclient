
import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
  
import useMapLocation from "./useMapLocation";
import MapCenterUpdater from "./MapCenterUpdater";
import useCurrentLocation from "./useCurrentLocation";
import { Navigation } from "lucide-react";


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

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return;
    }

    // Only recenter if the map is far from the requested location
    const currentCenter = map.getCenter();

    const distance = map.distance(
      currentCenter,
      [lat, lng]
    );

    if (distance > 20) {
      map.setView(
        [lat, lng],
        map.getZoom(), // keep current zoom
        {
          animate: true,
        }
      );
    }
  }, [
    location?.latitude,
    location?.longitude,
    map,
  ]);

  return null;
};


/*
|--------------------------------------------------------------------------
| Full Screen Location Picker
|--------------------------------------------------------------------------
*/

const FullScreenLocationPicker = ({
  type = "pickup",
  initialLocation,
  onConfirm,
  onCancel,
}) => {

  const {
    location,
    address,
    updateLocation,
    reverseGeocode,
  } = useMapLocation(initialLocation);


  /*
  |--------------------------------------------------------------------------
  | Current GPS location
  |--------------------------------------------------------------------------
  */

  const {
    getCurrentLocation,
    loading: locationLoading,
  } = useCurrentLocation();


  /*
  |--------------------------------------------------------------------------
  | Reverse geocode
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
  | Map moved
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
  | Use Current Location
  |--------------------------------------------------------------------------
  */

  const handleCurrentLocation = async () => {
    try {

      const currentLocation =
        await getCurrentLocation();

      updateLocation(
        currentLocation.latitude,
        currentLocation.longitude
      );

      /*
       * updateLocation changes the map position.
       * reverseGeocode will automatically run
       * because latitude/longitude changed.
       */

    } catch (error) {

      console.error(
        "Current location error:",
        error
      );

      alert(
        "Unable to get your current location. Please allow location permission."
      );
    }
  };


  /*
  |--------------------------------------------------------------------------
  | Confirm
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
  | Loading
  |--------------------------------------------------------------------------
  */

  if (!location) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-[9999]">

        <p className="text-gray-500">
          Loading map...
        </p>

      </div>
    );
  }


  return (
    <div className="fixed inset-0 z-[9999] bg-white">


      {/* ============================================================
          MAP
      ============================================================ */}

      <MapContainer
        center={[
          Number(location.latitude),
          Number(location.longitude),
        ]}
        zoom={15}
        scrollWheelZoom={true}
        zoomControl={true}
        doubleClickZoom={true}
        touchZoom={true}
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


      {/* ============================================================
          TOP BAR
      ============================================================ */}

      <div
        className="
          absolute
          top-0
          left-0
          right-0
          z-[1000]
          p-4
        "
      >

        <div
          className="
            bg-white
            rounded-2xl
            shadow-lg
            p-4
            flex
            items-center
            gap-3
          "
        >

          <button
            type="button"
            onClick={onCancel}
            className="
              w-10
              h-10
              rounded-full
              bg-gray-100
              flex
              items-center
              justify-center
              text-xl
              hover:bg-gray-200
            "
          >
            ←
          </button>

          <div>

            <h2 className="font-bold text-gray-900">
              {type === "pickup"
                ? "Select Pickup Location"
                : "Select Drop Location"}
            </h2>

            <p className="text-xs text-gray-500">
              Move the map to select location
            </p>

          </div>

        </div>

      </div>


      {/* ============================================================
          CENTER MARKER
      ============================================================ */}

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

        <div className="text-5xl">
          📍
        </div>

      </div>


      {/* ============================================================
          CURRENT LOCATION BUTTON
      ============================================================ */}

      <div
        className="
          absolute
          right-4
          bottom-[210px]
          z-[1000]
        "
      >

        <button
          type="button"
          onClick={handleCurrentLocation}
          disabled={locationLoading}
          className="
            w-12
            h-12
            rounded-full
            bg-white
            shadow-xl
            border
            border-gray-200
            flex
            items-center
            justify-center
            text-blue-600
            hover:bg-blue-50
            active:scale-95
            transition
            disabled:opacity-60
          "
          title="Use current location"
        >

          <Navigation
            size={22}
            className={
              locationLoading
                ? "animate-pulse"
                : ""
            }
          />

        </button>

      </div>


      {/* ============================================================
          BOTTOM PANEL
      ============================================================ */}

      <div
        className="
          absolute
          bottom-0
          left-0
          right-0
          z-[1000]
          p-4
        "
      >

        <div
          className="
            bg-white
            rounded-3xl
            shadow-2xl
            p-5
          "
        >

          <p className="text-xs text-gray-500 mb-1">
            Selected location
          </p>

          <p className="font-semibold text-gray-900 mb-4">
            {locationLoading
              ? "Getting your current location..."
              : address || "Finding address..."}
          </p>


          <button
            type="button"
            onClick={handleConfirm}
            disabled={locationLoading}
            className="
              w-full
              bg-indigo-600
              hover:bg-indigo-700
              disabled:bg-gray-400
              text-white
              py-4
              rounded-2xl
              font-bold
              text-lg
              transition
              active:scale-[0.98]
            "
          >

            Confirm{" "}

            {type === "pickup"
              ? "Pickup"
              : "Drop"}

          </button>

        </div>

      </div>

    </div>
  );
};

export default FullScreenLocationPicker;

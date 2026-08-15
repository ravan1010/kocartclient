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
| Recenter Map
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

    const currentCenter = map.getCenter();

    const distance = map.distance(
      currentCenter,
      [lat, lng]
    );

    if (distance > 20) {
      map.setView(
        [lat, lng],
        map.getZoom(),
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

const AppFullScreenLocationPicker = ({
  type = "pickup",
  initialLocation,
  onConfirm,
  onCancel,
}) => {

  /*
  |--------------------------------------------------------------------------
  | Read location from URL
  |--------------------------------------------------------------------------
  */

  const params = new URLSearchParams(
    window.location.search
  );

  const urlType =
    params.get("type");

  const urlLatitude =
    Number(params.get("latitude"));

  const urlLongitude =
    Number(params.get("longitude"));

  /*
  |--------------------------------------------------------------------------
  | Final type
  |--------------------------------------------------------------------------
  */

  const locationType =
    urlType || type || "pickup";

  /*
  |--------------------------------------------------------------------------
  | Final initial location
  |--------------------------------------------------------------------------
  */

  const urlLocation =
    Number.isFinite(urlLatitude) &&
    Number.isFinite(urlLongitude)
      ? {
          latitude: urlLatitude,
          longitude: urlLongitude,
        }
      : initialLocation;

  /*
  |--------------------------------------------------------------------------
  | Map Location Hook
  |--------------------------------------------------------------------------
  */

  const {
    location,
    address,
    updateLocation,
    reverseGeocode,
  } = useMapLocation(
    urlLocation
  );

  /*
  |--------------------------------------------------------------------------
  | Current GPS
  |--------------------------------------------------------------------------
  */

  const {
    getCurrentLocation,
    loading: locationLoading,
  } = useCurrentLocation();

  /*
  |--------------------------------------------------------------------------
  | Reverse Geocode
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!location) return;

    const lat = Number(
      location.latitude
    );

    const lng = Number(
      location.longitude
    );

    if (
      !Number.isFinite(lat) ||
      !Number.isFinite(lng)
    ) {
      return;
    }

    reverseGeocode(
      lat,
      lng
    );
  }, [
    location?.latitude,
    location?.longitude,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Map Location Changed
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
  | Send message to React Native
  |--------------------------------------------------------------------------
  */

  const sendToReactNative = (
    data
  ) => {

    if (
      window.ReactNativeWebView
    ) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify(data)
      );

      return true;
    }

    return false;
  };

  /*
  |--------------------------------------------------------------------------
  | Current Location
  |--------------------------------------------------------------------------
  */

  const handleCurrentLocation =
    async () => {

      try {

        const currentLocation =
          await getCurrentLocation();

        updateLocation(
          currentLocation.latitude,
          currentLocation.longitude
        );

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
  | Cancel
  |--------------------------------------------------------------------------
  */

  const handleCancel = () => {

    const sent =
      sendToReactNative({
        type: "LOCATION_CANCEL",
      });

    /*
     * Normal Web usage
     */
    if (
      !sent &&
      onCancel
    ) {
      onCancel();
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Confirm
  |--------------------------------------------------------------------------
  */

  const handleConfirm = () => {

    if (!location) {

      alert(
        "Please select a location"
      );

      return;
    }

    const latitude =
      Number(location.latitude);

    const longitude =
      Number(location.longitude);

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude)
    ) {

      alert(
        "Invalid location"
      );

      return;
    }

    const result = {
      type: "LOCATION_SELECTED",

      locationType,

      latitude,

      longitude,

      address:
        address || "",
    };

    /*
     * React Native WebView
     */
    const sent =
      sendToReactNative(result);

    /*
     * Normal React Web
     */
    if (
      !sent &&
      onConfirm
    ) {
      onConfirm({
        type: locationType,
        latitude,
        longitude,
        address:
          address || "",
      });
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (!location) {

    return (
      <div
        className="
          fixed
          inset-0
          bg-white
          flex
          items-center
          justify-center
          z-[9999]
        "
      >

        <div className="text-center">

          <div
            className="
              w-10
              h-10
              border-4
              border-gray-200
              border-t-indigo-600
              rounded-full
              animate-spin
              mx-auto
              mb-3
            "
          />

          <p className="text-gray-500">
            Loading map...
          </p>

        </div>

      </div>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Main UI
  |--------------------------------------------------------------------------
  */

  return (
    <div
      className="
        fixed
        inset-0
        z-[9999]
        bg-white
      "
    >

      {/* ==========================================================
          MAP
      ========================================================== */}

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

      {/* ==========================================================
          TOP BAR
      ========================================================== */}

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
            onClick={handleCancel}
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
              active:scale-95
            "
          >
            ←
          </button>

          <div>

            <h2
              className="
                font-bold
                text-gray-900
              "
            >
              {locationType === "pickup"
                ? "Select Pickup Location"
                : "Select Drop Location"}
            </h2>

            <p
              className="
                text-xs
                text-gray-500
              "
            >
              Move the map to select location
            </p>

          </div>

        </div>

      </div>

      {/* ==========================================================
          CENTER MARKER
      ========================================================== */}

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

      {/* ==========================================================
          CURRENT LOCATION BUTTON
      ========================================================== */}

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
          onClick={
            handleCurrentLocation
          }
          disabled={
            locationLoading
          }
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

      {/* ==========================================================
          BOTTOM PANEL
      ========================================================== */}

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

          <p
            className="
              text-xs
              text-gray-500
              mb-1
            "
          >
            Selected location
          </p>

          <p
            className="
              font-semibold
              text-gray-900
              mb-4
            "
          >
            {locationLoading
              ? "Getting your current location..."
              : address ||
                "Finding address..."}
          </p>

          <button
            type="button"
            onClick={
              handleConfirm
            }
            disabled={
              locationLoading
            }
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

            {locationType === "pickup"
              ? "Pickup"
              : "Drop"}

          </button>

        </div>

      </div>

    </div>
  );
};

export default AppFullScreenLocationPicker;
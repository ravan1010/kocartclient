import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import api from "../api";

// ==================================================
// FIX LEAFLET DEFAULT MARKER
// ==================================================

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// ==================================================
// ACTIVE STATUSES
// ==================================================

const ACTIVE_STATUSES = [
  "driver_assigned",
  "driver_arrived",
  "picked_up",
  "in_transit",
];

// ==================================================
// STATUS TEXT
// ==================================================

const getStatusText = (status) => {
  switch (status) {
    case "pending":
      return "Searching for a driver...";

    case "driver_assigned":
      return "Driver assigned";

    case "driver_arrived":
      return "Driver has arrived";

    case "picked_up":
      return "Goods picked up";

    case "in_transit":
      return "Goods are on the way";

    case "completed":
      return "Booking completed";

    case "cancelled":
      return "Booking cancelled";

    default:
      return "Order status";
  }
};

// ==================================================
// DRIVER ICON
// ==================================================

const driverIcon = new L.DivIcon({
  className: "driver-marker",

  html: `
    <div style="
      width:42px;
      height:42px;
      border-radius:50%;
      background:#4f46e5;
      border:4px solid white;
      box-shadow:0 3px 12px rgba(0,0,0,.3);
      display:flex;
      align-items:center;
      justify-content:center;
      font-size:22px;
    ">
      🛺
    </div>
  `,

  iconSize: [42, 42],
  iconAnchor: [21, 21],
});

// ==================================================
// RECENTER MAP WHEN DRIVER MOVES
// ==================================================

const RecenterMap = ({ location }) => {
  const map = useMap();

  useEffect(() => {
    if (!location) return;

    const lat = Number(location.latitude);
    const lng = Number(location.longitude);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return;
    }

    map.setView([lat, lng], map.getZoom(), {
      animate: true,
    });
  }, [
    location?.latitude,
    location?.longitude,
    map,
  ]);

  return null;
};

// ==================================================
// MAIN COMPONENT
// ==================================================

const GoodsAutoTracking = () => {
  const [booking, setBooking] = useState(null);
  const [userId, setUserId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==================================================
  // GET LOGGED-IN USER
  // ==================================================

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await api.get("/api/setting", {
          withCredentials: true,
        });

        const id = response.data?.user?._id;

        if (!id) {
          setError("User not found");
          setLoading(false);
          return;
        }

        setUserId(id);
      } catch (error) {
        console.error("Get user error:", error);

        setError("Unable to load user");
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // ==================================================
  // GET ACTIVE BOOKING + DRIVER LOCATION
  // ==================================================

  const getDriverLocation = async () => {
    if (!userId) return;

    try {
      const response = await api.get(
        `/api/goods-auto/booking/driver-location/${userId}`,
        {
          withCredentials: true,
        }
      );

      // No active booking
      if (!response.data.success) {
        setBooking(null);
        setError("");
        return;
      }

      const bookings = response.data.bookings || [];

      if (!bookings.length) {
        setBooking(null);
        setError("");
        return;
      }

      // Backend sorts newest first
      setBooking(bookings[0]);

      setError("");
    } catch (error) {
      console.error(
        "Get driver location error:",
        error
      );

      setError(
        error.response?.data?.message ||
        "Unable to load booking"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // FIRST BOOKING LOAD
  // ==================================================

  useEffect(() => {
    if (!userId) return;

    getDriverLocation();
  }, [userId]);

  // ==================================================
  // LIVE DRIVER LOCATION
  // EVERY 5 SECONDS
  // ==================================================

  useEffect(() => {
    if (!userId) return;

    const interval = setInterval(() => {
      getDriverLocation();
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [userId]);

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <div className="p-6 text-center">

        <div
          className="
            w-8 h-8
            border-4
            border-gray-200
            border-t-indigo-600
            rounded-full
            animate-spin
            mx-auto
          "
        />

        <p className="text-sm text-gray-500 mt-3">
          Loading booking...
        </p>

      </div>
    );
  }

  // ==================================================
  // ERROR
  // ==================================================

  if (error) {
    return (
      <div
        className="
          m-4
          p-4
          rounded-2xl
          bg-red-50
          text-red-700
        "
      >
        {error}
      </div>
    );
  }

  // ==================================================
  // NO ACTIVE BOOKING
  // ==================================================

  if (!booking) {
    return (
      <div className="p-6 text-center">

        <div className="text-4xl">
          📦
        </div>

        <h2 className="font-bold text-gray-900 mt-3">
          No active booking
        </h2>

        <p className="text-sm text-gray-500 mt-2">
          You don't have an active goods-auto booking.
        </p>

      </div>
    );
  }

  const status = booking.status;

  // ==================================================
  // PENDING
  // ==================================================

  if (status === "pending") {
    return (
      <div className="p-4">

        <div
          className="
            bg-white
            rounded-3xl
            shadow-sm
            border
            border-gray-100
            p-6
            text-center
          "
        >

          <div
            className="
              w-20
              h-20
              rounded-full
              bg-indigo-50
              flex
              items-center
              justify-center
              mx-auto
              text-4xl
            "
          >
            🛺
          </div>

          <h2
            className="
              text-xl
              font-bold
              text-gray-900
              mt-5
            "
          >
            Searching for a driver
          </h2>

          <p
            className="
              text-sm
              text-gray-500
              mt-2
            "
          >
            We're finding nearby goods-auto drivers
            for your booking.
          </p>

          <div className="mt-5 flex justify-center">

            <div className="flex gap-2">

              <span
                className="
                  w-2 h-2
                  bg-indigo-600
                  rounded-full
                  animate-bounce
                "
              />

              <span
                className="
                  w-2 h-2
                  bg-indigo-600
                  rounded-full
                  animate-bounce
                  [animation-delay:150ms]
                "
              />

              <span
                className="
                  w-2 h-2
                  bg-indigo-600
                  rounded-full
                  animate-bounce
                  [animation-delay:300ms]
                "
              />

            </div>

          </div>

        </div>

      </div>
    );
  }

  // ==================================================
  // ACTIVE DRIVER TRACKING
  // ==================================================

  if (ACTIVE_STATUSES.includes(status)) {

    const driverLocation =
      booking.driver?.currentLocation || null;

    const driverLat =
      Number(driverLocation?.latitude);

    const driverLng =
      Number(driverLocation?.longitude);

    const hasDriverLocation =
      Number.isFinite(driverLat) &&
      Number.isFinite(driverLng);

    // ==================================================
    // DRIVER LOCATION NOT AVAILABLE
    // ==================================================

    if (!hasDriverLocation) {
      return (
        <div className="p-4">

          <div
            className="
              bg-white
              rounded-3xl
              border
              border-gray-100
              shadow-sm
              p-6
              text-center
            "
          >

            <div className="text-4xl">
              🛺
            </div>

            <h2
              className="
                font-bold
                text-gray-900
                mt-3
              "
            >
              {getStatusText(status)}
            </h2>

            <p
              className="
                text-sm
                text-gray-500
                mt-2
              "
            >
              Waiting for driver's live location...
            </p>

          </div>

        </div>
      );
    }

    // ==================================================
    // DRIVER POSITION
    // ==================================================

    const driverPosition = [
      driverLat,
      driverLng,
    ];

    // ==================================================
    // PICKUP LOCATION
    // ==================================================

    const pickup = booking.pickupLocation;

    const pickupLat =
      Number(pickup?.latitude);

    const pickupLng =
      Number(pickup?.longitude);

    const hasPickup =
      Number.isFinite(pickupLat) &&
      Number.isFinite(pickupLng);

    // ==================================================
    // MAP
    // ==================================================

    return (
      <div
        className="
          fixed
          inset-0
          bg-white
        "
      >

        <MapContainer
          center={driverPosition}
          zoom={15}
          scrollWheelZoom={true}
          className="w-full h-full"
        >

          <TileLayer
            url={`https://maps.geoapify.com/v1/tile/osm-bright-smooth/{z}/{x}/{y}.png?apiKey=${
              import.meta.env.VITE_GEOAPIFY_KEY
            }`}
            attribution="© OpenStreetMap contributors"
          />

          {/* RECENTER MAP WHEN DRIVER MOVES */}

          <RecenterMap
            location={driverLocation}
          />

          {/* DRIVER */}

          <Marker
            position={driverPosition}
            icon={driverIcon}
          >

            <Popup>
              🛺 Goods Auto
            </Popup>

          </Marker>

          {/* PICKUP */}

          {hasPickup && (
            <Marker
              position={[
                pickupLat,
                pickupLng,
              ]}
            >

              <Popup>
                Pickup location
              </Popup>

            </Marker>
          )}

          {/* DRIVER → PICKUP */}

          {hasPickup && (
            <Polyline
              positions={[
                driverPosition,
                [
                  pickupLat,
                  pickupLng,
                ],
              ]}
              pathOptions={{
                color: "#4f46e5",
                weight: 5,
              }}
            />
          )}

        </MapContainer>

        {/* ==================================================
            TOP STATUS
        ================================================== */}

        <div
          className="
            absolute
            top-4
            left-4
            right-4
            z-[1000]
          "
        >

          <div
            className="
              bg-white
              rounded-2xl
              shadow-lg
              p-4
            "
          >

            <div className="flex items-center gap-3">

              <div
                className="
                  w-11
                  h-11
                  rounded-full
                  bg-indigo-100
                  flex
                  items-center
                  justify-center
                  text-2xl
                "
              >
                🛺
              </div>

              <div className="flex-1">

                <p className="text-xs text-gray-500">
                  Booking status
                </p>

                <h2 className="font-bold text-gray-900">
                  {getStatusText(status)}
                </h2>

              </div>

              <div
                className="
                  w-3
                  h-3
                  bg-green-500
                  rounded-full
                  animate-pulse
                "
              />

            </div>

          </div>

        </div>

        {/* ==================================================
            DRIVER INFO
        ================================================== */}

        <div
          className="
            absolute
            bottom-4
            left-4
            right-4
            z-[1000]
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

            <div className="flex items-center gap-3">

              <div
                className="
                  w-12
                  h-12
                  rounded-full
                  bg-gray-100
                  flex
                  items-center
                  justify-center
                  text-2xl
                "
              >
                👨‍✈️
              </div>

              <div className="flex-1">

                <p className="text-xs text-gray-500">
                  Your driver
                </p>

                <p className="font-bold text-gray-900">
                  {booking.driver?.name ||
                    "Goods Auto Driver"}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  🛺{" "}
                  {booking.driver?.vehicalNO ||
                    booking.driver?.vehicalName ||
                    "Goods Auto"}
                </p>

              </div>

            </div>

            <div
              className="
                mt-4
                bg-green-50
                border
                border-green-100
                rounded-xl
                px-3
                py-2
                text-sm
                text-green-700
                font-medium
              "
            >
              📍 Live location updating
            </div>

          </div>

        </div>

      </div>
    );
  }

  // ==================================================
  // OTHER STATUS
  // ==================================================

  return (
    <div className="p-4">

      <div
        className="
          bg-white
          rounded-3xl
          border
          border-gray-100
          shadow-sm
          p-6
          text-center
        "
      >

        <div className="text-4xl">
          📦
        </div>

        <h2 className="font-bold text-gray-900 mt-3">
          {getStatusText(status)}
        </h2>

      </div>

    </div>
  );
};

export default GoodsAutoTracking;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.js";
import MainNavbar from "./navbar.jsx";
import FullScreenLocationPicker from "../hooks/AppFullScreenLocationPicker.jsx";

export default function Home() {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [category, setCategory] = useState([]);
  const [city, setCity] = useState("");
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingLoc, setLoadingLoc] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [update, setUpdate] = useState();
  const [link, setLink] = useState("");

  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);

  // =====================================================
  // LOAD SERVICES
  // =====================================================

  useEffect(() => {
    load();

    const interval = setInterval(() => {
      load();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const load = async () => {
    try {
      const res = await api.get("/api/app/services");

      setServices(res.data.category || []);
      setCategory(res.data.category || []);
      setCity(res.data.city || "");
      setUpdate(res.data.update || 0);
      setLink(res.data.link || "");
      setUser(res.data.user || "");
    } catch (err) {
      console.log("Load services error:", err);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // OPEN LOCATION PICKER
  // =====================================================

  const openLocationPicker = () => {
    setLocationError("");
    setShowLocationPicker(true);
  };

  // =====================================================
  // LOCATION CONFIRM
  // =====================================================

  const handleLocationConfirm = async (location) => {
    try {
      setLoadingLoc(true);
      setLocationError("");

      console.log("Selected location:", location);

      const latitude = Number(location.latitude);
      const longitude = Number(location.longitude);

      if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude)
      ) {
        setLocationError("Invalid location selected.");
        return;
      }

      // Save location to backend
      await api.put(
        "/api/app/user/location",
        {
          latitude: latitude.toFixed(6),
          longitude: longitude.toFixed(6),
          city: location.address || "",
        },
        {
          withCredentials: true,
        }
      );

      console.log("Location saved");

      setSelectedLocation({
        latitude,
        longitude,
        address: location.address || "",
      });

      setShowLocationPicker(false);

      // Reload services/user
      await load();
    } catch (error) {
      console.log(
        "Save selected location error:",
        error?.response?.data || error
      );

      setLocationError(
        error?.response?.data?.message ||
          error?.message ||
          "Unable to update location."
      );
    } finally {
      setLoadingLoc(false);
    }
  };

  // =====================================================
  // LOCATION CANCEL
  // =====================================================

  const handleLocationCancel = () => {
    console.log("Location picker cancelled");
    setShowLocationPicker(false);
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin" />

        <p className="mt-4 text-gray-500 text-lg">
          Loading...
        </p>
      </div>
    );
  }

  // =====================================================
  // LOCATION PICKER
  // =====================================================

  if (showLocationPicker) {
    return (
      <FullScreenLocationPicker
        type="user"
        initialLocation={selectedLocation}
        onConfirm={handleLocationConfirm}
        onCancel={handleLocationCancel}
      />
    );
  }

  // =====================================================
  // LOCATION NOT SELECTED
  // =====================================================

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="w-full max-w-md flex flex-col items-center justify-center py-16 px-4">

          {/* LOGO */}
          <div className="text-3xl font-black tracking-widest text-blue-950 mb-8">
            KO
            <span className="text-orange-600">
              CA
            </span>
            RT
          </div>

          {/* LOCATION BUTTON */}
          <button
            type="button"
            onClick={openLocationPicker}
            disabled={loadingLoc}
            className={`
              px-5 py-3
              rounded-xl
              bg-white
              border border-gray-300
              shadow-sm
              font-semibold
              text-gray-700
              transition
              ${
                loadingLoc
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-50 active:scale-95"
              }
            `}
          >
            {loadingLoc ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
                Updating...
              </span>
            ) : (
              "📍 Turn On Location"
            )}
          </button>

          {locationError && (
            <p className="mt-4 text-sm text-red-600 text-center">
              {locationError}
            </p>
          )}
        </div>
      </div>
    );
  }

  // =====================================================
  // FORCE UPDATE
  // =====================================================

  if (Number(update) === 1 || Number(update) === 2) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">

        <div className="w-10 h-10 border-4 border-gray-200 border-t-green-600 rounded-full animate-spin mb-5" />

        <h2 className="text-2xl font-bold text-green-600">
          Update Kocart
        </h2>

        <h2 className="text-2xl font-bold text-green-600">
          Play Store
        </h2>

        {link && (
          <button
            type="button"
            onClick={() => window.open(link, "_blank")}
            className="mt-5 text-blue-600 underline font-medium"
          >
            Visit Play Store
          </button>
        )}
      </div>
    );
  }

  // =====================================================
  // MAIN HOME
  // =====================================================

  return (
    <div className="min-h-screen bg-white pb-24">

      <main className="max-w-5xl mx-auto px-4 pt-7 pb-10">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <header className="mb-5">

          {/* LOCATION */}
          <div className="flex items-center mb-5">

            <div className="text-3xl mr-3">
              📍
            </div>

            <div>
              <p className="text-[11px] text-gray-500 font-bold tracking-widest">
                YOUR LOCATION
              </p>

              <p className="text-sm font-semibold text-gray-800 max-w-[500px] break-words">
                {city || "Select Location"} ▼
              </p>
            </div>

          </div>

          {/* LOGO + CHANGE LOCATION */}
          <div className="border-t border-gray-200 pt-3 flex items-center justify-between gap-4">

            <div className="text-2xl md:text-3xl font-black tracking-[3px] text-blue-950">
              KO
              <span className="text-orange-600">
                CA
              </span>
              RT
            </div>

            <button
              type="button"
              onClick={openLocationPicker}
              disabled={loadingLoc}
              className={`
                px-4 py-2.5
                rounded-xl
                border border-gray-300
                bg-white
                text-sm font-semibold
                text-gray-700
                shadow-sm
                transition
                whitespace-nowrap
                ${
                  loadingLoc
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-50 active:scale-95"
                }
              `}
            >
              {loadingLoc ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
                  Updating...
                </span>
              ) : (
                "📍 Change Location"
              )}
            </button>

          </div>
        </header>

        {/* =====================================================
            LOCATION ERROR
        ===================================================== */}

        {locationError && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
            <p className="text-sm text-red-600">
              {locationError}
            </p>
          </div>
        )}

        {/* =====================================================
            SERVICES
        ===================================================== */}

        <section className="space-y-4">

          {/* =====================================================
              3 WHEEL GOODS AUTO
          ===================================================== */}

          {services.includes("goods_auto") && (
            <ServiceCard
              title="3 wheel Goods Auto"
              description="Transport items & shipments"
              icon="🚚"
              type="goods"
              onPress={() =>
                navigate("/goods-auto", {
                  state: {
                    type: "goods_auto",
                  },
                })
              }
            />
          )}

          {/* =====================================================
              4 WHEEL GOODS AUTO
          ===================================================== */}

          {services.includes("4_wheel_goods_auto") && (
            <ServiceCard
              title="4 wheel Goods Auto"
              description="Transport items & shipments"
              icon="🚚"
              type="goods"
              onPress={() =>
                navigate("/goods-auto", {
                  state: {
                    type: "4_wheel_goods_auto",
                  },
                })
              }
            />
          )}

          {/* =====================================================
              EMPTY STATE
          ===================================================== */}

          {services.length === 0 &&
            category.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16">

                <div className="text-5xl mb-4">
                  📍
                </div>

                <p className="text-lg font-semibold text-gray-400 text-center">
                  No services available nearby.
                </p>

              </div>
            )}

        </section>
      </main>

      {/* =====================================================
          BOTTOM NAVBAR
      ===================================================== */}

      <MainNavbar active="Home" />
    </div>
  );
}

// =====================================================
// SERVICE CARD
// =====================================================

function ServiceCard({
  title,
  description,
  icon,
  onPress,
  type,
}) {
  const getCardStyle = () => {
    switch (type) {
      case "food":
        return {
          card: "bg-orange-50 border-orange-200",
          title: "text-orange-900",
          arrow: "bg-white",
        };

      case "grocery":
        return {
          card: "bg-green-50 border-green-200",
          title: "text-emerald-900",
          arrow: "bg-white",
        };

      case "parcel":
        return {
          card: "bg-blue-50 border-blue-200",
          title: "text-blue-900",
          arrow: "bg-white",
        };

      case "passenger":
        return {
          card: "bg-yellow-50 border-yellow-200",
          title: "text-yellow-900",
          arrow: "bg-white",
        };

      case "goods":
      default:
        return {
          card: "bg-teal-50 border-teal-200",
          title: "text-teal-900",
          arrow: "bg-white",
        };
    }
  };

  const style = getCardStyle();

  return (
    <button
      type="button"
      onClick={onPress}
      className={`
        w-full
        min-h-[180px]
        rounded-3xl
        p-6
        border
        text-left
        flex
        flex-col
        justify-between
        overflow-hidden
        transition
        hover:shadow-md
        active:scale-[0.98]
        ${style.card}
      `}
    >

      {/* TOP */}
      <div className="flex">

        <div className="flex-1">

          <h2
            className={`
              text-2xl
              font-extrabold
              ${style.title}
            `}
          >
            {title}
          </h2>

          <p className="text-sm text-gray-600 mt-2 leading-5">
            {description}
          </p>

        </div>

      </div>

      {/* BOTTOM */}
      <div className="flex justify-between items-end mt-6">

        {/* ARROW */}
        <div
          className={`
            w-11
            h-11
            rounded-full
            flex
            items-center
            justify-center
            ${style.arrow}
          `}
        >
          <span className="text-xl font-bold">
            →
          </span>
        </div>

        {/* ICON */}
        <div className="text-5xl">
          {icon}
        </div>

      </div>

    </button>
  );
}
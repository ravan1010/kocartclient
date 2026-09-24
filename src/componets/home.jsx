import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.js";
import MainNavbar from "./navbar.jsx";
import FullScreenLocationPicker from "../hooks/AppFullScreenLocationPicker.jsx";
import Footer from "./Footer.jsx";
import NoServices from "../om/NoServices.jsx";

export default function Home() {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
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
      const res = await api.get("/api/services");

      setServices(res.data.serviceTypes || []);
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
        "/api/user/location",
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
              ${loadingLoc
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
    <>
      <MainNavbar />
      <div className="min-h-screen bg-white pb-24">

        <main className="max-w-5xl mx-auto px-4 pt-7 pb-10">

          {/* =====================================================
            HEADER
        ===================================================== */}

         <header className="mb-5">
            <button
              type="button"
              onClick={openLocationPicker}
              disabled={loadingLoc}
              className={`
                w-full
                flex
                items-center
                text-left
                px-4
                py-3
                rounded-2xl
                border
                border-gray-200
                bg-white
                shadow-sm
                transition
                ${loadingLoc
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-50 active:scale-[0.99]"
                }
              `}
            >
              {loadingLoc ? (
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />

                  <span className="text-sm font-semibold text-gray-700">
                    Updating location...
                  </span>
                </div>
              ) : (
                <>
                  {/* LOCATION ICON */}
                  <div className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                    <span className="text-2xl">
                      📍
                    </span>
                  </div>

                  {/* LOCATION TEXT */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-gray-500 font-bold tracking-widest">
                      YOUR LOCATION
                    </p>

                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {city || "Select Location"}
                    </p>
                  </div>

                  {/* DROPDOWN ARROW */}
                  <div className="text-gray-500 text-lg ml-2">
                    ▼
                  </div>
                </>
              )}
            </button>
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
                title="3 Wheel Goods Auto"
                description="Transport goods, parcels & shipments"
                icon="🛺"
                type="goods3"
                onPress={() => navigate("/goodsAuto/goods_auto")}
              />
            )}


            {/* =====================================================
                  4 WHEEL GOODS AUTO
              ===================================================== */}

            {services.includes("4_wheel_goods_auto") && (
              <ServiceCard
                title="4 Wheel Goods Auto"
                description="Transport heavy goods & shipments"
                icon="🚚"
                type="goods4"
                onPress={() => navigate("/goodsAuto/4_wheel_goods_auto")}
              />
            )}

            {/* =====================================================
              EMPTY STATE
          ===================================================== */}

            {services.length === 0 &&
             (
              <NoServices
                onRetry={() => {
                  window.location.reload();
                }}
              />
              )}

          </section>
        </main>

        {/* =====================================================
          BOTTOM NAVBAR
      ===================================================== */}

      </div>
      <Footer />
    </>
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
      case "goods3":
        return {
          card: "bg-teal-50 border-teal-200",
          title: "text-teal-900",
          arrow: "bg-white",
        };

      case "goods4":
        return {
          card: "bg-cyan-50 border-cyan-200",
          title: "text-cyan-900",
          arrow: "bg-white",
        };

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

      <div className="flex justify-between items-end mt-6">
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
          <span className="text-xl font-bold">→</span>
        </div>

        <div className="text-5xl">
          {icon}
        </div>
      </div>
    </button>
  );
}
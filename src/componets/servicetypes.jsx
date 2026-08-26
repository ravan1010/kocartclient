import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import axios from "axios";
import Navbar from "./navbar"


export default function ServerTypes() {
  const navigate = useNavigate();
 
  const [services, setServices] = useState([]);
  const [category, setCategory] = useState([]);
  const [city, setCity] = useState("");
  const [user, setuser] = useState();
  const [loading, setLoading] = useState(true);
  const [loadingLoc, setLoadingLoc] = useState(false);
  const [locationError, setLocationError] = useState("");

 useEffect(() => {
  load();

  const interval = setInterval(() => {
    load();
  }, 5000); // 5 seconds

  return () => clearInterval(interval);
}, []);

  const load = async () => {
    try {
      const res = await api.get("/api/services", {});
      setServices(res.data.serviceTypes || []);
      setCategory(res.data.category || []);
      setCity(res.data.city || "");
      setuser(res.data.user || '')
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const changeLocation = async () => {
    setLoadingLoc(true);
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported.");
      setLoadingLoc(false);
      return;
    }

    try {
      const permission = await navigator.permissions.query({
        name: "geolocation",
      });

      if (permission.state === "denied") {
        setLocationError(
          "Location permission is blocked. Please enable it in browser settings."
        );
        setLoadingLoc(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude.toFixed(6);
          const lon = position.coords.longitude.toFixed(6);

          try {
            const geo = await axios.get(
              "https://api.geoapify.com/v1/geocode/reverse",
              {
                params: {
                  lat,
                  lon,
                  format: "json",
                  apiKey: "9101d57bd3a34d2194bb8222a55a6a3f",
                },
              }
            );

            const cityName =
              geo.data?.results?.[0]?.city ||
              geo.data?.results?.[0]?.town ||
              geo.data?.results?.[0]?.village ||
              "Unknown Location";

            await api.put(
              "/api/user/location",
              {
                latitude: lat,
                longitude: lon,
                city: cityName,
              },
              {
                withCredentials: true,
              }
            );

            setCity(cityName);
            await load(); // Refresh services/data
          } catch (err) {
            console.log(err);
            setLocationError("Failed to update location.");
          } finally {
            setLoadingLoc(false);
          }
        },
        (err) => {
          console.log(err);
          setLocationError(err.message);
          setLoadingLoc(false);
        }
      );
    } catch (err) {
      console.log(err);
      setLocationError("Unable to access location.");
      setLoadingLoc(false);
    }
  };

if(user === false ){
  return(
    <div className="flex justify-between border-t w-full p-2">
            <div className="text-2xl font-black tracking-wider text-blue-900 uppercase">
              KO<span className="text-orange-600">CA</span>RT
            </div>
            <div>
              <button
                onClick={changeLocation}
                disabled={loadingLoc}
                className="px-4 py-2 text-sm font-semibold rounded-xl disabled:opacity-50 border border-gray-300 hover:border-gray-400 bg-white shadow-sm transition-all text-gray-700 flex items-center gap-2"
              >
                {loadingLoc ? "Updating..." : "📍 turn on Location"}
              </button>
            </div>
          </div>
  )
}

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-xl font-medium text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <>
            <Navbar />

    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header Container */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-3 text-gray-800">
            <div className="text-3xl">📍</div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                Your Location
              </p>
              <h1 className="text-xl font-bold flex items-center gap-1">
                {city || "Select Location"}{" "}
                <span className="text-sm font-normal text-gray-500">▼</span>
              </h1>
            </div>
          </div>

          <div className="flex justify-between border-t w-full p-2">
            <div className="text-2xl font-black tracking-wider text-blue-900 uppercase">
              KO<span className="text-orange-600">CA</span>RT
            </div>
            <div>
              <button
                onClick={changeLocation}
                disabled={loadingLoc}
                className="px-4 py-2 text-sm font-semibold rounded-xl disabled:opacity-50 border border-gray-300 hover:border-gray-400 bg-white shadow-sm transition-all text-gray-700 flex items-center gap-2"
              >
                {loadingLoc ? "Updating..." : "📍 Change Location"}
              </button>
            </div>
          </div>
        </div>

      </div>

      {locationError && (
        <p className="text-red-500 text-sm mb-4">{locationError}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Food Card */}
        {category.includes("foodANDbeverages") && (
          <button
            onClick={() => navigate("/resturant")}
            className="group relative bg-gradient-to-br from-amber-50 to-orange-50 border border-orange-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-orange-300 transition-all duration-300 text-left flex flex-col justify-between overflow-hidden"
          >
            <div>
              <h2 className="text-2xl font-extrabold text-orange-900 group-hover:text-orange-600 transition-colors">
                Food
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Delicious food delivered fast
              </p>
            </div>
            <div className="flex items-end justify-between mt-6">
              <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
                →
              </div>
              <div className="text-5xl select-none">🍲</div>
            </div>
          </button>
        )}

        {/* Grocery Card */}
        {category.includes("groceryFruitsANDvegetables") && (
          <button
            onClick={() => navigate("/mart")}
            className="group relative bg-gradient-to-br from-emerald-50 to-green-50 border border-green-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-green-300 transition-all duration-300 text-left flex flex-col justify-between overflow-hidden"
          >
            <div>
              <h2 className="text-2xl font-extrabold text-emerald-900 group-hover:text-green-600 transition-colors">
                Grocery
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Fresh groceries at your doorstep
              </p>
            </div>
            <div className="flex items-end justify-between mt-6">
              <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-green-500 group-hover:bg-green-500 group-hover:text-white transition-all duration-300">
                →
              </div>
              <div className="text-5xl select-none">🛍️</div>
            </div>
          </button>
        )}
        

        {/* Empty State */}
        {services.length === 0 && category.length === 0 && (
          <div className="col-span-full text-center py-16 text-gray-400 font-medium text-lg">
            No services available nearby.
          </div>
        )}
      </div>

      <Footer />
    </div>
    </>
  );
}
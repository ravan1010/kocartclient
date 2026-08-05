import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function ServerTypes() {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [category, setcategory] = useState([]);
  const [city, setcity] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get("/api/services", {});
        setServices(res.data.serviceTypes || []);
        setcategory(res.data.category || []);
        setcity(res.data.city || "");
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-xl font-medium text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* City Header Display */}
      {city && (
        <div className="mb-6 flex items-center space-x-2 text-gray-800">
          <span className="text-2xl">📍</span>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Your Location</p>
            <h1 className="text-xl font-bold">{city}</h1>
          </div>
        </div>
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

        {/* Bike Parcel Card */}
        {services.includes("bike_parcel") && (
          <button
            onClick={() => navigate("/bike-parcel")}
            className="group relative bg-gradient-to-br from-sky-50 to-blue-50 border border-blue-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 text-left flex flex-col justify-between overflow-hidden"
          >
            <div>
              <h2 className="text-2xl font-extrabold text-blue-900 group-hover:text-blue-600 transition-colors">
                Bike Parcel
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Express, contactless delivery
              </p>
            </div>
            <div className="flex items-end justify-between mt-6">
              <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all duration-300">
                →
              </div>
              <div className="text-5xl select-none">🏍️</div>
            </div>
          </button>
        )}

        {/* Passenger Auto Card */}
        {services.includes("auto_passenger") && (
          <button
            className="group relative bg-gradient-to-br from-amber-50 to-yellow-50 border border-yellow-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-yellow-300 transition-all duration-300 text-left flex flex-col justify-between overflow-hidden"
          >
            <div>
              <h2 className="text-2xl font-extrabold text-yellow-900 group-hover:text-yellow-600 transition-colors">
                Passenger Auto
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Affordable city rides
              </p>
            </div>
            <div className="flex items-end justify-between mt-6">
              <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-yellow-600 group-hover:bg-yellow-500 group-hover:text-white transition-all duration-300">
                →
              </div>
              <div className="text-5xl select-none">🛺</div>
            </div>
          </button>
        )}

        {/* Goods Auto Card */}
        {services.includes("goods_auto") && (
          <button
            className="group relative bg-gradient-to-br from-emerald-50 to-teal-50 border border-teal-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-teal-300 transition-all duration-300 text-left flex flex-col justify-between overflow-hidden"
          >
            <div>
              <h2 className="text-2xl font-extrabold text-teal-900 group-hover:text-teal-600 transition-colors">
                Goods Auto
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Transport items & shipments
              </p>
            </div>
            <div className="flex items-end justify-between mt-6">
              <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-all duration-300">
                →
              </div>
              <div className="text-5xl select-none">🚚</div>
            </div>
          </button>
        )}

        {/* Home Service Card (Uncomment if needed dynamically via backend or leave static) */}
        {/* 
        <button
          className="group relative bg-gradient-to-br from-cyan-50 to-sky-50 border border-sky-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-sky-300 transition-all duration-300 text-left flex flex-col justify-between overflow-hidden"
        >
          <div>
            <h2 className="text-2xl font-extrabold text-cyan-900 group-hover:text-cyan-600 transition-colors">
              Home Service
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Professional services at home
            </p>
          </div>
          <div className="flex items-end justify-between mt-6">
            <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white transition-all duration-300">
              →
            </div>
            <div className="text-5xl select-none">🧹</div>
          </div>
        </button> 
        */}

        {/* Empty State */}
        {services.length === 0 && category.length === 0 && (
          <div className="col-span-full text-center py-16 text-gray-400 font-medium text-lg">
            No services available nearby.
          </div>
        )}
      </div>
    </div>
  );
}
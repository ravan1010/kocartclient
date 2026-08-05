import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function ServerTypes() {
    const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [category, setcategory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const load = async () => {
      try {
        const res = await api.get("/api/services", {});

        setServices(res.data.serviceTypes);
        setcategory(res.data.category);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    load()
  }, []);

  if (loading) return <h2>Loading...</h2>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

      {category.includes("foodANDbeverages") && (
        <button
          onClick={() => navigate("/resturant")}
          className="group bg-white border border-gray-200 rounded-2xl p-6  shadow-sm hover:shadow-xl hover:border-green-500 transition-all duration-300 text-left"
        >
          <div className="text-5xl mb-4"></div>

          <h2 className="text-lg font-bold text-gray-800 group-hover:text-green-600">
            foods
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Fast delivery within 5 km.
          </p>
        </button>
      )}

      {category.includes("groceryFruitsANDvegetables") && (
        <button
          onClick={() => navigate("/mart")}
          className="group bg-white border border-gray-200 rounded-2xl p-6  shadow-sm hover:shadow-xl hover:border-green-500 transition-all duration-300 text-left"
        >
          <div className="text-5xl mb-4"></div>

          <h2 className="text-lg font-bold text-gray-800 group-hover:text-green-600">
            grocery and etc..
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Fast delivery within 5 km.
          </p>
        </button>
      )}

      {services.includes("bike_parcel") && (
        <button
          onClick={() => navigate("/bike-parcel")}
          className="group bg-white border border-gray-200 rounded-2xl p-6  shadow-sm hover:shadow-xl hover:border-green-500 transition-all duration-300 text-left"
        >
          <div className="text-5xl mb-4">🏍</div>

          <h2 className="text-lg font-bold text-gray-800 group-hover:text-green-600">
            Bike Parcel
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Fast parcel delivery within 5 km.
          </p>
        </button>
      )}

      {services.includes("goods_auto") && (
        <button
          className="group bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-yellow-500 transition-all duration-300 text-left"
        >
          <div className="text-5xl mb-4">🛺</div>

          <h2 className="text-lg font-bold text-gray-800 group-hover:text-yellow-600">
            Goods Auto
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Transport heavy goods nearby.
          </p>
        </button>
      )}

      {services.includes("auto_passenger") && (
        <button
          className="group bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-blue-500 transition-all duration-300 text-left"
        >
          <div className="text-5xl mb-4">🚖</div>

          <h2 className="text-lg font-bold text-gray-800 group-hover:text-blue-600">
            Passenger Auto
          </h2>

          <p className="text-sm text-gray-500 mt-2">
            Book an auto ride instantly.
          </p>
        </button>
      )}

      {services.length === 0 && category.length === 0 && (
        <div className="col-span-full text-center py-10 text-gray-500">
          No services available nearby.
        </div>
      )}
    </div>
  );
}
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./navbar";
import Footer from "./Footer";
import api from "../api";
import useSaveLocation from "../hooks/useSaveLocation";

const Home = () => {
  const navigate = useNavigate();

  useSaveLocation();

  const [merchants, setMerchants] = useState([]);

  useEffect(() => {
    const fetchMerchant = async () => {
      try {
        const res = await api.get("/api/home", {
          withCredentials: true,
        });

        setMerchants(res.data.merchants || []);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMerchant();
  }, []);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 p-4">

  <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-md p-5">

    <h2 className="text-xl font-bold text-gray-800 mb-4">
      Nearby Merchants
    </h2>

    {merchants.length > 0 ? (
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {merchants.map((merchant) => (
          <button
            key={merchant._id}
            onClick={() => navigate(`/merchant?id=${merchant._id}`)}
            className="min-w-[180px] bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl p-4 shadow hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            <div className="text-lg font-semibold">
              {merchant.companyName}
            </div>

            <p className="text-sm text-blue-100 mt-1">
              View Products →
            </p>
          </button>
        ))}
      </div>
    ) : (
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center">
        <h3 className="text-lg font-semibold text-gray-700">
          No Nearby Merchants
        </h3>

        <p className="text-gray-500 mt-2">
          We are not available in your area right now.
        </p>
      </div>
    )}

  </div>

  <Footer />
</div>
    </>
  );
};

export default Home;
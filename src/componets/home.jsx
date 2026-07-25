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

      <div className="min-h-screen bg-gray-50">
        <div className="flex gap-3 overflow-x-auto py-3 px-3">
          {merchants.length > 0 ? (
            merchants.map((merchant) => (
              <button
                key={merchant._id}
                onClick={() => navigate(`/merchant?id=${merchant._id}`)}
                className="px-5 py-2 rounded-full bg-blue-500 text-white whitespace-nowrap"
              >
                {merchant.companyName}
              </button>
            ))
          ) : (
            <p className="text-gray-500">
              We are not available in your area.
            </p>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Home;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./navbar";
import Footer from "./Footer";
import api from "../api";

const Grocery = () => {
  const navigate = useNavigate();

  const [merchants, setMerchants] = useState([]);

  const fetchMerchant = async () => {
    try {
      const res = await api.get("/api/mart", {
        withCredentials: true,
      });

      setMerchants(res.data.merchants || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const load = async () => {
      await fetchMerchant();
    }

    load();
  }, []);


  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-md p-5">

          <h2 className="text-xl font-bold">Nearby Merchants</h2>

          {merchants.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {merchants.map((merchant) => (
                <button
                  key={merchant._id}
                  onClick={() => navigate(`/mart/merchant?id=${merchant._id}`)}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl p-4"
                >
                  <h3 className="font-semibold">{merchant.companyName}</h3>
                  <p className="text-sm mt-1">View →</p>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <h3 className="text-lg font-semibold">
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

export default Grocery;
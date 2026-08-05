import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./navbar";
import Footer from "./Footer";
import api from "../api";

const Grocery = () => {
  const navigate = useNavigate();

  const [merchants, setMerchants] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMerchant = async () => {
    try {
      const res = await api.get("/api/mart", {
        withCredentials: true,
      });

      setMerchants(res.data.merchants || []);
      setPosts(res.data.posts || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMerchant();
  }, []);

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

      <div className="min-h-screen bg-gray-100 p-4 space-y-6">
        {/* Nearby Merchants Section */}
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-md p-5">
          <h2 className="text-xl font-bold mb-4">Nearby Merchants</h2>

          {merchants.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {merchants.map((merchant) => (
                <button
                  key={merchant._id}
                  onClick={() => navigate(`/mart/merchant?id=${merchant._id}`)}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl p-4 text-left shadow-sm hover:shadow-md transition-all"
                >
                  <h3 className="font-semibold text-lg">{merchant.companyName}</h3>
                  <p className="text-sm mt-1 opacity-90">View Store →</p>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <h3 className="text-lg font-semibold">No Nearby Merchants</h3>
              <p className="text-gray-500 mt-2">
                We are not available in your area right now.
              </p>
            </div>
          )}
        </div>

        {/* Posts / Featured Products Section (Based on your layout design) */}
        {posts.length > 0 && (
          <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-md p-5">
            <h2 className="text-xl font-bold mb-4">Featured Products & Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((postItem, index) => (
                <div
                  key={postItem._id || index}
                  className="border border-gray-200 rounded-2xl p-4 shadow-sm bg-white flex flex-col justify-between"
                >
                  {/* Header info matching merchant card style */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {postItem.merchantLogo ? (
                        <img
                          src={postItem.merchantLogo}
                          alt="Logo"
                          className="w-12 h-12 rounded-full object-cover border"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-blue-900 text-white flex items-center justify-center font-bold">
                          {postItem.companyName?.[0] || "M"}
                        </div>
                      )}
                      <div>
                        <h3 className="font-bold text-gray-800 flex items-center gap-1">
                          {postItem.companyName || "Merchant"}
                          <span className="text-blue-500 text-sm">✔</span>
                        </h3>
                        <p className="text-xs text-gray-500">
                          {postItem.tagline || "Premium Quality Products"}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        navigate(`/mart/merchant?id=${postItem.merchantId}`)
                      }
                      className="px-3 py-1.5 text-xs font-semibold border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-all"
                    >
                      Visit Store &gt;
                    </button>
                  </div>

                  {/* Product Images Preview Grid */}
                  {postItem.images && postItem.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {postItem.images.slice(0, 4).imgUrl || postItem.images.map((img, i) => (
                        <div
                          key={i}
                          className="bg-gray-100 rounded-xl overflow-hidden h-32 flex items-center justify-center"
                        >
                          <img
                            src={typeof img === "string" ? img : img.url}
                            alt="Product"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <Footer />
      </div>
    </>
  );
};

export default Grocery;
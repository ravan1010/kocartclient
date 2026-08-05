import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./navbar";
import Footer from "./Footer";
import api from "../api";

const Home = () => {
  const navigate = useNavigate();

  const [merchants, setMerchants] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMerchant = async () => {
    try {
      const res = await api.get("/api/home", {
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
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex justify-center items-center h-64 text-xl font-medium text-gray-500">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <div>
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 py-6">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-6">
            Nearby Merchants
          </h2>

          {merchants.length > 0 ? (
            <div className="space-y-6">
              {merchants.map((merchant) => {
                // Filter posts/products specific to this merchant using flexible identifier matching
                const merchantPosts = posts.filter(
                  (p) => 
                    p.author === merchant._id || 
                    p.merchant === merchant._id ||
                    p.merchantId === merchant._id ||
                    p.author?._id === merchant._id ||
                    p.merchant?._id === merchant._id
                );

                return (
                  <div
                    key={merchant._id}
                    className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all"
                  >
                    {/* Merchant Header Info */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                      <div className="flex items-center gap-4">
                        <img
                          src={merchant.logo || "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=150"}
                          alt={merchant.companyName}
                          className="w-16 h-16 rounded-full object-cover border-2 border-gray-100 shadow-sm"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-lg font-bold text-gray-900">
                              {merchant.companyName}
                            </h3>
                            {/* Verified Badge */}
                            <svg
                              className="w-5 h-5 text-blue-500 flex-shrink-0"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                            </svg>
                          </div>
                          <p className="text-sm text-gray-500 mt-0.5">
                            {merchant.tagline || "Premium Quality Products"}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => navigate(`/mart/merchant?id=${merchant._id}`)}
                          className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 flex items-center gap-2 transition-all shadow-sm"
                        >
                          <span>🏪</span> Visit Store <span className="text-gray-400">›</span>
                        </button>
                        <button
                          onClick={() => navigate(`/mart/merchant?id=${merchant._id}`)}
                          className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 flex items-center gap-2 transition-all shadow-sm"
                        >
                          Visit More <span className="text-blue-200">›</span>
                        </button>
                      </div>
                    </div>

                    {/* Product / Post Previews */}
                    {merchantPosts.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
                        {merchantPosts.slice(0, 4).map((postItem, idx) => {
                          // Safely resolve image regardless of whether it's an array, string, or named differently
                          const rawImg = postItem.image || postItem.imageUrl || postItem.photos;
                          const imageUrl = Array.isArray(rawImg) ? rawImg[0] : rawImg;

                          return (
                            <div
                              key={idx}
                              onClick={() => navigate(`/mart/merchant?id=${merchant._id}`)}
                              className="group relative bg-gray-100 rounded-xl overflow-hidden aspect-square cursor-pointer border border-gray-100"
                            >
                              {imageUrl && (
                                <img
                                  src={imageUrl}
                                  alt={postItem.title || "Product"}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
              <div className="text-4xl mb-3">🛒</div>
              <h3 className="text-lg font-bold text-gray-800">
                No Nearby Merchants
              </h3>
              <p className="text-gray-500 mt-1 text-sm">
                We are not available in your area right now.
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
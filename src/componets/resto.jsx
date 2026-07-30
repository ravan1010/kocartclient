import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api";
import Navbar from "./navbar";
import Footer from "./Footer";
import OrganizerCard from "./OrganizerCard";

const MerchantPage = () => {
  const [searchParams] = useSearchParams();
  const merchantId = searchParams.get("id");

  const [restaurantData, setRestaurantData] = useState([]);
  const [branch, setBranch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState("all");


  // Fetch selected merchant
  const fetchMerchantData = async () => {
    try {
      if (!merchantId) return;

      const res = await api.get(`/api/merchant?id=${merchantId}`, {
        withCredentials: true,
      });

      setBranch(res.data.branch);
      setRestaurantData(res.data.products || []);
      setOpen(res.data.open);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMerchantData();
  }, [merchantId]);


  const uniqueEvents = [
    "all",
    ...new Set(restaurantData.map((item) => item.variantname)),
  ];

  const filteredRestaurants = restaurantData.filter((item) => {
    return (
      selectedEvent === "all" ||
      item.variantname === selectedEvent
    );
  });

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="text-center py-20">Loading...</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      {/* Merchant Header */}
      <div className="bg-white shadow-sm p-5">
        <h1 className="text-2xl font-bold">
          {branch?.companyName}
        </h1>

        <p
          className={`mt-2 inline-block px-3 py-1 rounded-full text-sm font-medium ${
            open
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {open ? "Open" : "Closed"}
        </p>
      </div>

      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-md p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold">Products</h2>
          </div>

          {/* Variant Filter */}
          <div className="flex gap-3 overflow-x-auto py-3 mb-6 scrollbar-hide">
            {uniqueEvents.map((event) => (
              <button
                key={event}
                onClick={() => setSelectedEvent(event)}
                className={`whitespace-nowrap px-5 py-2 rounded-full border transition ${
                  selectedEvent === event
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white border-gray-300 text-gray-700"
                }`}
              >
                {event}
              </button>
            ))}
          </div>

          {/* Products */}
          {filteredRestaurants.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filteredRestaurants.map((product) => (
                <OrganizerCard
                  key={product._id}
                  organizer={product}
                  Open={open}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              No products found.
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default MerchantPage;
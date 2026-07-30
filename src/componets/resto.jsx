import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api";
import Footer from "./Footer";
import OrganizerCard from "./OrganizerCard";

import Navbar from "./navbar";

function MerchantPage() {
  const [searchParams] = useSearchParams();
  const merchantId = searchParams.get("id");

   const [restaurantData, setRestaurantData] = useState([]);
  const [branch, setBranch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState("all");

   useEffect(() => {

     const loadMerchant = async () => {
      try {
        const res = await api.get(`/api/merchant/${merchantId}`);

        setRestaurantData(res.data.posts || []);
        setBranch(res.data.branch);
        setOpen(res.data.branch?.open || false);
      } catch (error) {
        console.error(error);
        setRestaurantData([]);
      } finally {
        setLoading(false);
      }
    }
     loadMerchant();
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
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white mt-3">Loading...</p>
        </div>
      </div>
    );
  }

    if (!merchantId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Merchant not found.
      </div>
    );
  }

    return (
    <>
      <Navbar />
       <div className="min-h-screen bg-gray-50">

        {/* Merchant Header */}
        <div className="bg-white shadow-sm p-5">

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
        <div className="p-4">
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
            </div>
                      {filteredRestaurants.length !== 0 ? (
                         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 p-1">
              {filteredRestaurants.map((product) => (
                <OrganizerCard
                  key={product._id}
                  organizer={product}
                  Open={open}
                />
                 ))}
            </div>
            ) : (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-gray-700">
                No Products Available
              </h2>
               <p className="text-gray-500 mt-2">
                This merchant has no products in this category.
              </p>
              </div>
          )}
        </div>
            <Footer />
            </>
  );
}

export default MerchantPage;
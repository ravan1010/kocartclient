import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api";
import OrganizerCard from "./OrganizerCard";
import Navbar from "./navbar";
import Footer from "./Footer";

function MARTMerchantVariants() {

    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");

    const [variants, setVariants] = useState([]);
    const [loading, setLoading] = useState(true);

    const [selectedVariant, setSelectedVariant] = useState("");
    const [filteredPosts, setFilteredPosts] = useState([]);

    const [open, setOpen] = useState(false);

    useEffect(() => {
        fetchVariants();
    }, []);


    console.log("Route id:", id);

   const fetchVariants = async () => {
  try {
    const res = await api.get(`/api/mart/variants/${id}`, {
      withCredentials: true,
    });

    if (res.data.success) {
      const variantList = res.data.variants;

      setVariants(variantList);

      // Automatically select the first variant
      if (variantList.length > 0) {
        const firstVariant = variantList[0];
        setSelectedVariant(firstVariant);

        // Load products for the first variant
        const productRes = await api.get("/api/mart/marchent/product", {
          params: {
            id,
            variant: firstVariant,
          },
          withCredentials: true,
        });

        setFilteredPosts(productRes.data.posts);
        setOpen(productRes.data.branch?.open || false);
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

    const handleFilter = async (variant) => {
        try {
            setSelectedVariant(variant);

            const res = await api.get("/api/mart/marchent/product", {
                params: {
                    id,
                    variant,
                },
                withCredentials: true,
            });

            setFilteredPosts(res.data.posts);
            setOpen(res.data.branch?.open || false);
        } catch (err) {
            console.log(err);
        }
    };

    const uniqueEvents = variants;



    if (loading) return <p>Loading...</p>;

    return (
        <>
        <Navbar />
  <div className="w-full py-4">


    {/* Category Buttons */}
    {variants.length > 0 ? (
      <>
        <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-md py-3 mb-5">
          <div className="flex gap-3 overflow-x-auto scrollbar-hide px-2">
            {uniqueEvents.map((event) => (
              <button
                key={event}
                onClick={() => handleFilter(event)}
                className={`flex-shrink-0 px-5 py-2 rounded-full border font-medium transition-all duration-300 shadow-sm ${
                  selectedVariant === event
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white border-transparent shadow-lg scale-105"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-orange-50 hover:border-orange-400 hover:text-orange-600"
                }`}
              >
                {event}
              </button>
            ))}
          </div>
        </div>

        {/* Products */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {filteredPosts.map((product) => (
              <div
                key={product._id}
                className="transition-transform duration-300 hover:scale-105"
              >
                <OrganizerCard
                  organizer={product}
                  Open={open}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="text-6xl mb-3">🍽️</div>
            <h2 className="text-xl font-semibold text-gray-700">
              No Products Found
            </h2>
            <p className="text-gray-500 mt-2">
              Select another category to view products.
            </p>
          </div>
        )}
      </>
    ) : (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="text-6xl mb-3">📂</div>
        <h2 className="text-xl font-semibold text-gray-700">
          No Categories Available
        </h2>
        <p className="text-gray-500 mt-2">
          This merchant hasn't added any categories yet.
        </p>
      </div>
    )}
  </div>
  <Footer />
  </>
);
}

export default MARTMerchantVariants;
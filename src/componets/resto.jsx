import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api";
import Navbar from "./navbar";
import Footer from "./Footer";
import OrganizerCard from "./OrganizerCard";

const MerchantPage = () => {
  const [searchParams] = useSearchParams();
  const merchantId = searchParams.get("id");

  const [merchant, setMerchant] = useState(null);
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState("all");

  useEffect(() => {
    if (merchantId) {
      fetchMerchant();
    } else {
      setLoading(false);
    }
  }, [merchantId]);

  const fetchMerchant = async () => {
    try {
      const res = await api.get(`/api/merchant?id=${merchantId}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        setMerchant(res.data.merchant);
        setProducts(res.data.posts || []);
        setOpen(res.data.branch.open ?? false);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const variants = [
    "all",
    ...new Set(products.map((item) => item.variantname).filter(Boolean)),
  ];

  const filteredProducts =
    selectedVariant === "all"
      ? products
      : products.filter(
          (item) => item.variantname === selectedVariant
        );

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="py-20 text-center text-xl">Loading...</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="bg-white shadow-sm p-5">
        <h1 className="text-3xl font-bold">
          {merchant?.companyName}
        </h1>

        <span
          className={`inline-block mt-3 px-3 py-1 rounded-full text-sm ${
            open
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {open ? "Open" : "Closed"}
        </span>
      </div>

      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto p-5">

          <div className="flex gap-3 overflow-x-auto mb-6">
            {variants.map((variant) => (
              <button
                key={variant}
                onClick={() => setSelectedVariant(variant)}
                className={`px-4 py-2 rounded-full border ${
                  selectedVariant === variant
                    ? "bg-indigo-600 text-white"
                    : "bg-white"
                }`}
              >
                {variant}
              </button>
            ))}
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {filteredProducts.map((product) => (
                <OrganizerCard
                  key={product._id}
                  organizer={product}
                  Open={open}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-500">
              No products found
            </div>
          )}

        </div>
      </div>

      <Footer />
    </>
  );
};

export default MerchantPage;
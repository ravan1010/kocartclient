import React, { useState, useMemo } from "react";
import { MapPin, Plus, Minus } from "lucide-react";
import api from "../api";
// import useClientauth from "../signup/auth/atokenauth.jsx"
import { useNavigate } from "react-router-dom";

const OrganizerCard = ({ organizer, Open }) => {

  // const { isAdmin } = useClientauth();
  const navigate = useNavigate();

  const [noti, setnoti] = useState(null);
  const [quantity, setquantity] = useState(1);
  const [showVariants, setShowVariants] = useState(false);
  const [selectedVariant, setSelectedVariant] =
    useState(organizer.variants?.[0]?._id || null);

  const selectedVariantData = useMemo(() => {
    return organizer.variants?.find(
      (v) => v._id === selectedVariant
    );
  }, [selectedVariant, organizer.variants]);

  const totalPrice = useMemo(() => {
    return selectedVariantDatart
      ? selectedVariantData.price * quantity
      : 0;
  }, [selectedVariantData, quantity]);

  const increase = () => {
    if (selectedVariantData && quantity >= 8) return;
    setquantity((prev) => prev + 1);
  }
  const decrease = () =>
    setquantity((prev) => (prev > 1 ? prev - 1 : 1));

  const addToCart = async (
    productId,
    variantid,
    quantity = 1,
    adminId
  ) => {
    if (!variantid) return;

    try {
      const res = await api.post(
        "/api/cart/add",
        { productId, quantity, variantid, adminId },
        { withCredentials: true }
      );

      if (res.data.success) {
        setnoti("Added");
        setTimeout(() => setnoti(null), 1000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {organizer.active && (
        <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative">

          {/* Closed Overlay */}
          {(!organizer.open || !Open) && (
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-20">
              <div className="bg-red-600 text-white px-5 py-2 rounded-xl font-bold">
                Closed
              </div>
            </div>
          )}

          {/* Image */}
          <div className="relative">
            <img
              src={organizer.image?.[0]}
              alt={organizer.name}
              className="w-full h-44 object-cover"
            />

            <div className="absolute top-3 left-3 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
              {organizer.companyName}
            </div>

            <div className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
              ₹{selectedVariantData.price}
            </div>

            {noti && (
              <div className="absolute inset-0 bg-green-600/90 flex items-center justify-center text-white font-bold text-lg">
                {noti}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 space-y-4">

            {/* Product */}
            <div>
              <h3 className="text-lg font-bold text-gray-800 line-clamp-1">
                {organizer.name}
              </h3>

              <p className="text-sm text-gray-500">
                {selectedVariantData.name}
              </p>
            </div>

            {/* Price */}
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xl font-bold text-green-600">
                  ₹{totalPrice}
                </p>

                <p className="text-xs text-gray-400 line-through">
                  MRP ₹{selectedVariantData.mrp * quantity}
                </p>
              </div>

              <div className="bg-green-50 px-3 py-2 rounded-xl">
                <p className="text-green-700 text-xs font-semibold">
                  Save ₹
                  {(selectedVariantData.mrp -
                    selectedVariantData.price) * quantity}
                </p>
              </div>
            </div>

            {/* Variant Button */}
            {organizer.variants?.length > 0 && (
              <button
                onClick={() => setShowVariants(true)}
                className="w-full py-2 bg-indigo-600 text-white rounded-xl font-medium"
              >
                Change Variant
              </button>
            )}

            {/* Quantity */}
            <div className="flex items-center justify-between">

              <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-2 py-2">

                <button
                  onClick={decrease}
                  className="w-8 h-8 bg-white rounded-lg shadow flex items-center justify-center"
                >
                  <Minus size={14} />
                </button>

                <span className="font-semibold min-w-[24px] text-center">
                  {quantity}
                </span>

                <button
                  onClick={increase}
                  className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center"
                >
                  <Plus size={14} />
                </button>

              </div>

              <span className="text-sm font-medium text-gray-600">
                {organizer.variantname}
              </span>
            </div>

            {/* Add Button */}
              <button
                onClick={() =>
                  addToCart(
                    organizer._id,
                    selectedVariant,
                    quantity,
                    organizer.author
                  )
                }
                disabled={
                  !organizer.active ||
                  !selectedVariant ||
                  !organizer.open
                }
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-lg disabled:bg-gray-300"
              >
                🛒 Add to Cart
              </button>
            
          </div>

          {/* Variant Modal */}
          {showVariants && (
            <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center">

              <div className="bg-white w-full max-w-md rounded-t-3xl p-4">

                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg">
                    Select Variant
                  </h3>

                  <button
                    onClick={() => setShowVariants(false)}
                    className="text-gray-500"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3 max-h-72 overflow-y-auto">

                  {organizer.variants.map((variant) => (
                    <div
                      key={variant._id}
                      onClick={() => {
                        setSelectedVariant(variant._id);
                        setShowVariants(false);
                      }}
                      className={`p-3 rounded-xl border cursor-pointer flex justify-between items-center
                    ${selectedVariant === variant._id
                          ? "border-indigo-600 bg-indigo-50"
                          : "border-gray-200"
                        }`}
                    >
                      <div>
                        <p className="font-medium">
                          {variant.name}
                        </p>

                        <p className="text-xs text-gray-400 line-through">
                          ₹{variant.mrp}
                        </p>
                      </div>

                      <p className="font-bold text-green-600">
                        ₹{variant.price}
                      </p>
                    </div>
                  ))}

                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default OrganizerCard;
import React, { useState, useMemo } from "react";
import { MapPin, Plus, Minus } from "lucide-react";
import api from "../api";

const OrganizerCard = ({ organizer }) => {
  const [noti, setnoti] = useState(null);
  const [quantity, setquantity] = useState(1);
  const [selectedVariant, setSelectedVariant] =
    useState(organizer.variants?.[0]?._id || null);

  const selectedVariantData = useMemo(() => {
    return organizer.variants?.find(
      (v) => v._id === selectedVariant
    );
  }, [selectedVariant, organizer.variants]);

  const totalPrice = useMemo(() => {
    return selectedVariantData
      ? selectedVariantData.price * quantity
      : 0;
  }, [selectedVariantData, quantity]);

  const increase = () => setquantity((prev) => prev + 1);
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
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition text-xs border border-gray-200 overflow-hidden relative">

      {/* Closed Overlay */}
      {!organizer.open && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10 text-white font-semibold text-sm">
          Closed
        </div>
      )}

      
      {/* Image */}
      <div className="relative">
        <img
          className="w-full h-32 object-cover"
          src={organizer.image?.[0]}
          alt={organizer.name}
        />

        <div className="absolute top-2 right-2 bg-indigo-600 text-white px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1">
          {organizer.name}
        </div>
        <div className="absolute bottom-2 left-2 bg-indigo-600 text-white px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1">
          {organizer.companyName}
        </div>

        {noti && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-green-600 text-white px-2 py-0.5 border-6 border-black rounded-md text-[15px] flex items-center justify-center">
            {noti}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-2 space-y-2">

        {/* Variants */}
        {organizer.variants?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {organizer.variants.map((variant) => (
              <button
                key={variant._id}
                onClick={() => setSelectedVariant(variant._id)}
                className={`px-2 py-0.5 rounded-full border text-[10px]
                  ${
                    selectedVariant === variant._id
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-gray-100 border-gray-300"
                  }`}
              >
                {variant.name} ₹{variant.price}
              </button>
            ))}
          </div>
        )}

        {/* Quantity + Price */}
        <div className="flex items-center justify-between">

          <div className="flex items-center gap-1">
            <button
              onClick={decrease}
              className="bg-gray-200 p-1 rounded-full"
            >
              <Minus size={10} />
            </button>

            <span className="font-medium text-xs">
              {quantity}
            </span>

            <button
              onClick={increase}
              className="bg-gray-200 p-1 rounded-full"
            >
              <Plus size={10} />
            </button>
          </div>

          <span className="font-semibold text-green-600 text-xs">
            ₹{totalPrice}
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
          disabled={!organizer.active || !selectedVariant || !organizer.open}
          className="w-full py-1 rounded-md text-white text-xs bg-green-600 hover:bg-green-700 disabled:bg-gray-300"
        >
          Add
        </button>

      </div>
    </div>
    )}
</>
  );
};

export default OrganizerCard;
import React, { useState, useMemo } from "react";
import { MapPin, Plus, Minus } from "lucide-react";
import api from "../api";

const OrganizerCard = ({ organizer, Open }) => {
  
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
    return selectedVariantData
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
        <div className="bg-white rounded-lg shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 text-xs border border-gray-200 overflow-hidden relative">
          {/* Closed Overlay */}
          {!organizer.open || !Open && (
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
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full bg-green-600 text-white rounded-md text-[15px] flex items-center justify-center animate-bounce">                {noti}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-2 space-y-2">

            <div className="flex justify-between gap-1 ">
              <p className="flex items-center gap-1 text-gray-500">
                {organizer.variantname}
              </p>
              <p className="text-md font-bold line-through">
                MRP : {selectedVariantData.mrp * quantity}
              </p>
            </div>

            {/* Variants */}
            {!showVariants && organizer.variants?.length > 0 && (
              <button
                onClick={() => setShowVariants(true)}
                className="w-full py-1 text-xs bg-indigo-600 text-white rounded-md"
              >
                Select Variant
              </button>
            )}
            {showVariants && organizer.variants?.length > 0 && (
              <button
                className="w-full py-1 text-xs bg-gray-300 text-gray-700 rounded-md cursor-not-allowed"
              >
                Selecting Variant
              </button>
            )}

            {showVariants && (
              <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 animate-fadeIn">
                <div className="bg-white w-full max-w-md rounded-t-xl p-3 space-y-2 animate-slideUp">
                  {/* Header */}
                  <div className="flex justify-between items-center border-b pb-2">
                    <p className="text-sm font-semibold">Select Variant</p>

                    <button
                      onClick={() => setShowVariants(false)}
                      className="text-gray-500 text-xs"
                    >
                      Close
                    </button>
                  </div>

                  {/* Variants */}
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {organizer.variants.map((variant) => (
                      <div
                        key={variant._id}
                        onClick={() => {
                          setSelectedVariant(variant._id);
                          setShowVariants(false);
                        }}
                        className={`flex items-center justify-between px-2 py-2 rounded-md border cursor-pointer
            ${selectedVariant === variant._id
                            ? "border-indigo-600 bg-indigo-50"
                            : "border-gray-200"
                          }`}
                      >
                        <div>
                          <p className="text-sm font-medium">{variant.name}</p>

                          <p className="text-xs line-through text-gray-400">
                            ₹{variant.mrp}
                          </p>
                        </div>

                        <p className="text-sm font-semibold text-green-600">
                          ₹{variant.price}
                        </p>
                      </div>
                    ))}
                  </div>

                </div>

              </div>
            )}
            {/* {organizer.variants?.length > 0 && (
          <div className="flex flex-col gap-1">
            
            {organizer.variants.map((variant) => (
              <>
              <div className="text-gray-500 text-[10px] px-1 ">
              <p >{variant.name}</p>
              </div>
              <div >
              <p >MRP : {variant.mrp}</p>
              </div>
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
                ₹{variant.price}
              </button>
              <br />
           </> ))}
          </div>
        )} */}

            {/* Variants */}


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

              <span className="font-semibold text-green-600 text-xs flex items-center gap-1">
                <p className="text-black"> {selectedVariantData.name} </p> : ₹{totalPrice}
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
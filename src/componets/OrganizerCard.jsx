// src/components/OrganizerCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';
// import isCartEnabled from './cartenable'; 
import { useState } from 'react';

import api from '../api';


const OrganizerCard = ({ organizer }) => {
  const [noti, setnoti] = useState()
  const [quantity, setquantity] = useState(1); // ✅ now setquantity is a real function
  const [selectedVariant, setSelectedVariant] = useState(null);


  // const reversedID = organizer._id.split("").reverse().join(""); // => "tcaer"

    const addToCart = async (productId, variantid, quantity = 1, adminId,  ) => {
      if(!selectedVariant){
        alert('select variant')
      }
      console.log(productId, variantid, quantity)
    try {
      const res = await api.post("/api/cart/add", { productId, quantity, variantid, adminId}, { withCredentials: true });
      console.log(res.data.message);
      if(res.data.success){
        setnoti('Added to cart')
        setTimeout(() => {
        setnoti()
      }, 1000);}
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group">

  {/* Image */}
  <div className="relative">
    <img
      className="w-full h-56 object-cover"
      src={organizer.image[0]}
      alt={organizer.name}
    />

    {/* Gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

    {/* City badge */}
    <div className="absolute top-2 right-2 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
      <MapPin size={14} />
      {organizer.cityTown}
    </div>

    {/* Notification badge */}
    {noti && (
      <div className="absolute top-2 left-2 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
        {noti}
      </div>
    )}
  </div>

  {/* Content */}
  <div className="p-4 space-y-2">

    <h3 className="text-lg font-bold text-gray-800 truncate">
      {organizer.name}
    </h3>

    <p className="text-sm text-gray-500 line-clamp-2">
      {organizer.description}
    </p>

    <div className="flex items-center justify-between mt-2 gap-2">
      <h4 className="font-semibold text-gray-700 truncate">
        {organizer.companyName}
      </h4>

      <select
        className="border rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
        value={selectedVariant || ''}
        onChange={(e) => setSelectedVariant(e.target.value)}
      >
        <option value="" disabled>
          Select Variant
        </option>
        {organizer.variants.map((variant) => (
          <option key={variant._id} value={variant._id}>
            {variant.name} – ₹{variant.price}
          </option>
        ))}
      </select>
    </div>

    {/* Quantity */}
    <div className="flex items-center justify-between">
      <label htmlFor="quantity" className="text-sm text-gray-600">
        Quantity
      </label>
      <select
        id="quantity"
        value={quantity}
        onChange={(e) => setquantity(Number(e.target.value))}
        className="border rounded-lg px-2 py-1 text-sm"
      >
        {[1, 2, 3, 4, 5].map((num) => (
          <option key={num} value={num}>
            {num}
          </option>
        ))}
      </select>
    </div>

    {/* Button */}
    <button
      onClick={() =>
        addToCart(organizer._id, selectedVariant, quantity, organizer.author)
      }
      disabled={!organizer.active}
      className={`w-full mt-3 py-2 rounded-xl font-semibold transition
        ${
          organizer.active
            ? "bg-green-600 hover:bg-green-700 text-white"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }
      `}
    >
      {organizer.active ? "Add to Cart" : "Store Closed"}
    </button>
  </div>
</div>

  );
};

export default OrganizerCard;
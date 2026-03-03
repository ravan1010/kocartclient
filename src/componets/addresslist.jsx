import api from '../api';
import { ArrowLeft } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

const Addresslist = () => {

    const [address, setaddress] = useState([])

      const fetchAddress = async () => {

      try {
        const res = await api.get(`/api/address-list`,
            {withCredentials: true}
        );
          setaddress(res.data.address)
          console.log(res.data.address)

      } catch (err) {
        console.error('Error loading open days', err);
      }
    };

    useEffect(() => {
        fetchAddress()
    },[])

  return (
    <div className="p-4 min-h-screen bg-gray-100">

  {/* Header */}
  <div className="flex items-center justify-between mb-4">
    <Link to="/profile" className="text-gray-700 hover:text-black">
      <ArrowLeft size={28} />
    </Link>

    <h1 className="font-bold text-2xl text-gray-800">
      Address List
    </h1>

    <Link
      to="/address"
      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-semibold shadow-md transition"
    >
      + Add
    </Link>
  </div>

  <hr className="mb-4" />

  {/* Address Cards */}
  {Array.isArray(address) && address.length > 0 ? (
    address.map((item, i) => (
      <div
        key={i}
        className="bg-white rounded-xl shadow-sm p-4 mb-3 border hover:shadow-md transition"
      >
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-lg text-gray-800">
            {item.Fullname}
          </h2>
          <span className="text-sm text-gray-500">
            {item.mobileNo}
          </span>
        </div>

        <p className="text-gray-700 text-sm mt-1">
          {item.FHBCA}, {item.ASSV}
        </p>

        <p className="text-gray-600 text-sm">
          {item.Landmark}
        </p>

        <p className="text-gray-500 text-sm mt-1">
          {item.cityTown}, {item.state} – {item.pincode}
        </p>
      </div>
    ))
  ) : (
    <div className="text-center text-gray-500 mt-10">
      No addresses added yet
    </div>
  )}
</div>

  )
}

export default Addresslist

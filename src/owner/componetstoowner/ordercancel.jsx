import React, { useEffect, useState } from 'react'
import OrderNavbar from './ordernavber'
import OwnerNavbar from './navbertoowner'
import api from '../../api';

export const Ordercancel = () => {
    const [order, setorder] = useState([]); // ✅ array not string
    const [loading, setLoading] = useState(false);
    
      const orderSchema = async () => {
  try {
    setLoading(true);
    const res = await api.get("/api/owner/getordercancel", { withCredentials: true });
    
    // console.log("API response:", res.data);

    // ✅ Adjust depending on API shape
    if (Array.isArray(res.data)) {
      setorder(res.data);
    } else if (res.data.orders) {
      setorder(res.data.orders);
    } else {
      setorder([res.data]);
    }

  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    orderSchema();
  }, []);
  return (
    <>
    <OwnerNavbar />
    <OrderNavbar />
    <div className="mb-2 md:mb-3 lg:mb-3 w-[95%] mx-auto">
        {loading && <p className="text-3xl font-bold">Loading...</p>}
        {!loading && order.length === 0 ? (
          <p className="text-xl font-semibold">No orders found</p>
        ) : (
          <>
          <p>orders</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {order.map((order, i) => (
            <div 
              key={i} 
              className="border rounded-lg shadow-md p-4 mb-4 bg-white"
            >
            {/* Order header */}
            <div className="flex justify-between border-b pb-2 mb-3">
              <p className="font-bold text-lg">Order #{order._id}</p>
              <p className="text-gray-600">Total: ₹{order.totalAmount}</p>
            </div>

              {/* Address */}
              {order.address && (
                <div className="mb-3">
                  <h3 className="font-semibold text-gray-700 mb-1">Shipping Address</h3>
                  <p className="text-sm font-bold text-gray-600">
                      name : {order.address.Fullname} <br />
                      Number : {order.number} <br />
                    {order.address.FHBCA}, {order.address.ASSV}, {order.address.Landmark}, {order.address.state} - {order.address.pincode}
                    <br />
                    ----------
                    Order on {order.status} ----------
                  </p>
                </div>
              )}

              {/* Items */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border-t pt-3">
                {order.items.map((data, idx) => (
                  <div 
                    key={idx} 
                    className="flex flex-col items-center border rounded-lg p-2"
                  >
                    <img
                      src={data.productId?.image[0]}
                      alt={data.productId?.name || "Product"}
                      className="w-20 h-20 object-cover rounded-md mb-2"
                    />
                    <p className="font-medium text-sm">{data.productId?.name}</p>
                    <p className="text-gray-600 text-sm">Qty: {data.quantity}</p>
                    <p className="font-semibold">add fee : ₹{data.price}</p>
                    <p>og : ₹{data.productId?.price}</p>
                  </div>
                ))}
              </div>
  </div>
))}

            </div>
          </>
        )}
      </div>
    </>
  )
}

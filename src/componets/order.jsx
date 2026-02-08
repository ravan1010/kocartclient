import api from '../api';
import React, { useEffect, useState } from 'react'
import Navbar from './navbar'
import Footer from './Footer'

export const Order = () => {
  const [order, setorder] = useState([]); // ✅ array not string
  const [loading, setLoading] = useState(false);

  const orderSchema = async () => {
  try {
    setLoading(true);
    const res = await api.get("/api/order", { withCredentials: true });
    
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
      <Navbar />
      <div className="w-[95%] mx-auto mb-4">
  {/* Loading */}
  {loading && (
    <div className="flex justify-center items-center h-40">
      <p className="text-2xl font-semibold animate-pulse text-gray-600">
        Loading orders...
      </p>
    </div>
  )}

  {/* Empty state */}
  {!loading && order.length === 0 ? (
    <div className="text-center py-20">
      <p className="text-2xl font-semibold text-gray-500">
        No orders found 🛒
      </p>
    </div>
  ) : (
    <>
      <h1 className="text-3xl font-bold text-gray-800 my-4">
        Your Orders
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(order) &&
          order.map((orderItem, orderIndex) => (
            <div
              key={orderIndex}
              className="bg-white border rounded-xl shadow-sm hover:shadow-md transition duration-300"
            >
              {/* Order Header */}
              <div className="flex justify-between items-center p-4 border-b">
                <p className="font-bold text-gray-800 text-sm">
                  Order #{orderItem._id.slice(-6)}
                </p>
                <p className="font-bold text-green-600">
                  ₹{orderItem.totalAmount}
                </p>
              </div>

              {/* Items */}
              <div className="grid grid-cols-2 gap-3 p-4">
                {orderItem.items.map((data, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="flex flex-col items-center text-center border rounded-lg p-3 hover:bg-gray-50 transition"
                  >
                    <img
                      src={data.productId?.image?.[0]}
                      alt={data.productId?.name || "Product"}
                      className="w-20 h-20 object-cover rounded-md"
                    />

                    <p className="text-sm font-medium mt-2 line-clamp-2">
                      {data.productId?.name}
                    </p>

                    <p className="text-xs text-gray-500">
                      Qty: {data.quantity}
                    </p>

                    <p className="font-semibold text-sm mt-1">
                      ₹{data.price}
                    </p>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="flex justify-between items-center p-4 border-t">
                <p className="text-sm font-semibold text-gray-700">
                  Status:
                </p>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold
                  ${
                    orderItem.status === "Delivered"
                      ? "bg-green-100 text-green-700"
                      : orderItem.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {orderItem.status}
                </span>
              </div>
            </div>
          ))}
      </div>
    </>
  )}
</div>

      <Footer />
    </>
  );
};

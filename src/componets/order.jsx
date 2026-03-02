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

      console.log("API response:", res.data);

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
      <div className="w-[95%] mx-auto mb-8">
        {/* Loading */}
        {loading && (
          <div className="flex flex-col justify-center items-center h-48">
            <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin mb-4" />
            <p className="text-lg font-medium text-gray-600">
              Loading your orders...
            </p>
          </div>
        )}

        {/* Empty state */}
        {!loading && order.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-3xl font-semibold text-gray-400">
              No orders found 🛒
            </p>
            <p className="text-gray-500 mt-2">
              Looks like you haven’t ordered anything yet
            </p>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-extrabold text-gray-900 my-6">
              Your Orders
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-l border-b gap-6">
              {Array.isArray(order) &&
                order.map((orderItem) => (
                  <div
                    key={orderItem._id}
                    className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden"
                  >
                    {/* Order Header */}
                    <div className="flex justify-between items-center px-5 py-4 bg-gray-50 border-b">
                      <p className="font-semibold text-gray-700 text-sm">
                        Order #{orderItem._id.slice(-6)}
                      </p>
                      <p className="font-bold text-lg text-green-600">
                        ₹{orderItem.totalAmount}
                      </p>
                    </div>

                    {/* Shops */}
                    <div className="p-4 space-y-4">
                      {orderItem.shop.map((shop) => (
                        <div
                          key={shop._id}
                          className="bg-gray-50 rounded-xl p-4"
                        >
                          <h3 className="font-bold text-gray-800 mb-3">
                            {shop.admin?.companyName}
                          </h3>

                          {shop?.items.map((item) => (
                            <div
                              key={item._id}
                              className="flex items-center justify-between py-3 border-b last:border-none"
                            >
                              <div className="flex gap-4">
                                <img
                                  src={item.productId?.image?.[0]}
                                  alt={item.productId?.name || "Product"}
                                  className="w-16 h-16 rounded-lg object-cover"
                                />

                                <div>
                                  <p className="font-semibold text-gray-800">
                                    {item.productId?.name}
                                  </p>
                                  <small className="text-gray-500">
                                    {item.name}
                                  </small>
                                  <p className="text-sm text-gray-600">
                                    Qty: {item.quantity}
                                  </p>
                                </div>
                              </div>

                              <p className="font-bold text-gray-900">
                                ₹{item.price * item.quantity}
                              </p>
                            </div>
                          ))}

                          <p className="text-right font-semibold text-gray-800 mt-3">
                            Shop Total: ₹{shop.subtotal}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Order Footer */}
                    <div className="flex justify-between items-center px-5 py-4 bg-gray-50 border-t">
                      <p className="text-sm font-medium text-gray-600">
                        Status
                      </p>

                      <span
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide
                    ${orderItem.status === "Delivered"
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

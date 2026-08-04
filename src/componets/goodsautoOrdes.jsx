import { useEffect, useState } from "react";
import api from "../api";

export default function GoodsAutoOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/api/goods-auto/all/orders");
      setOrders(res.data.orders);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    const interval = setInterval(fetchOrders, 5000);

    return () => clearInterval(interval);
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="space-y-4">
  {orders.length === 0 ? (
    <p>No Goods Auto Orders</p>
  ) : (
    orders.map((order) => (
      <div
        key={order._id}
        className="border rounded-xl p-4 shadow bg-white"
      >
        <h2 className="font-bold text-lg">{order.orderId}</h2>

        <p>
          <span className="font-semibold">Status:</span>{" "}
          {order.status}
        </p>

        <p>
          <span className="font-semibold">Pickup:</span>{" "}
          {order.pickup.address}
        </p>

        <p>
          <span className="font-semibold">Drop:</span>{" "}
          {order.drop.address}
        </p>

        <p>
          <span className="font-semibold">Distance:</span>{" "}
          {order.distance} km
        </p>

        <hr className="my-3" />

        <h3 className="font-bold mb-2">
          🚚 Goods Details
        </h3>

        <p>
          <span className="font-semibold">Item Type:</span>{" "}
          {order.goods?.itemType}
        </p>

        <p>
          <span className="font-semibold">Estimated Weight:</span>{" "}
          {order.goods?.estimatedWeight} kg
        </p>

        <p>
          <span className="font-semibold">Helpers Required:</span>{" "}
          {order.goods?.helpersRequired}
        </p>

        <p>
          <span className="font-semibold">Loading:</span>{" "}
          {order.goods?.loadingRequired ? "Yes" : "No"}
        </p>

        <p>
          <span className="font-semibold">Unloading:</span>{" "}
          {order.goods?.unloadingRequired ? "Yes" : "No"}
        </p>

        {order.goods?.instructions && (
          <p>
            <span className="font-semibold">Instructions:</span>{" "}
            {order.goods.instructions}
          </p>
        )}

        {/* Driver Details */}
        {(order.status === "accepted" ||
          order.status === "driver_assigned" ||
          order.status === "loaded" ||
          order.status === "in_transit") &&
          order.driver && (
            <>
              <hr className="my-3" />

              <h3 className="font-bold mb-2">
                🚛 Driver Details
              </h3>

              <p>
                <span className="font-semibold">Name:</span>{" "}
                {order.driver.name}
              </p>

              <p>
                <span className="font-semibold">Phone:</span>{" "}
                {order.driver.Number}
              </p>

              <p>
                <span className="font-semibold">Vehicle:</span>{" "}
                {order.driver.vehicalName}
              </p>

              <p>
                <span className="font-semibold">Vehicle No:</span>{" "}
                {order.driver.vehicalNO}
              </p>
            </>
          )}

        {/* Pickup OTP */}
        {order.status === "driver_assigned" && (
          <div className="mt-4 rounded-xl bg-yellow-100 border border-yellow-400 p-4 text-center">
            <p className="text-sm text-gray-700">
              Share this OTP before loading the goods
            </p>

            <h2 className="text-3xl font-bold tracking-widest text-yellow-700">
              {order.otp?.pickup}
            </h2>
          </div>
        )}

        {/* Goods Loaded */}
        {order.status === "loaded" && (
          <div className="mt-4 rounded-xl bg-blue-100 border border-blue-400 p-4 text-center">
            📦 Goods have been loaded.
          </div>
        )}

        {/* Delivery OTP */}
        {order.status === "in_transit" && (
          <div className="mt-4 rounded-xl bg-green-100 border border-green-400 p-4 text-center">
            <p className="text-sm text-gray-700">
              Share this OTP at delivery
            </p>

            <h2 className="text-3xl font-bold tracking-widest text-green-700">
              {order.otp?.delivery}
            </h2>
          </div>
        )}

        {/* Completed */}
        {order.status === "completed" && (
          <div className="mt-4 rounded-xl bg-green-50 border border-green-500 p-4 text-center">
            ✅ Goods Delivered Successfully
          </div>
        )}
      </div>
    ))
  )}
</div>
  );
}
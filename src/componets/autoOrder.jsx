
import { useEffect, useState } from "react";
import api from "../api";

export default function AutoOrders() {
  // ✅ Always start with an array
  const [orders, setOrders] = useState([]);

  const [year, setYear] = useState(
    new Date().getFullYear()
  );

  const [month, setMonth] = useState(
    new Date().getMonth() + 1
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);

        const res = await api.get(
          `/api/auto/orders/monthly?year=${year}&month=${month}`
        );

        if (res.data.success) {
          // Backend returns two arrays
          const passengerOrders =
            res.data.passengerOrders || [];

          const goodsOrders =
            res.data.goodsOrders || [];

          // Combine both
          const allOrders = [
            ...passengerOrders,
            ...goodsOrders,
          ].sort(
            (a, b) =>
              new Date(b.createdAt) -
              new Date(a.createdAt)
          );

          setOrders(allOrders);
        } else {
          setOrders([]);
        }

      } catch (error) {
        console.error("Failed to fetch orders:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [year, month]);

  return (
    <div className="max-w-5xl mx-auto p-5">

      {/* Month selector */}
      <div className="flex gap-3 mb-6">

        <select
          value={month}
          onChange={(e) =>
            setMonth(Number(e.target.value))
          }
          className="border rounded-xl p-3"
        >
          {[
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ].map((name, index) => (
            <option
              key={index}
              value={index + 1}
            >
              {name}
            </option>
          ))}
        </select>

        <select
          value={year}
          onChange={(e) =>
            setYear(Number(e.target.value))
          }
          className="border rounded-xl p-3"
        >
          {[2026, 2025, 2024].map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

      </div>

      {/* Orders */}
      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <div className="bg-gray-50 rounded-2xl p-8 text-center">
          <p className="text-gray-500">
            No orders found for this month.
          </p>
        </div>
      ) : (
        <div className="space-y-4">

          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white border rounded-2xl p-5 shadow-sm"
            >

              {/* Header */}
              <div className="flex justify-between gap-4">

                <div>
                  <h3 className="font-bold text-lg">

                    {order.serviceType === "auto_passenger"
                      ? "🚗 Passenger Auto"
                      : "📦 Goods Auto"}

                  </h3>

                  <p className="text-sm text-gray-500">
                    {order.createdAt
                      ? new Date(
                          order.createdAt
                        ).toLocaleDateString()
                      : "-"}
                  </p>
                </div>

                <span className="font-semibold capitalize">
                  {order.status || "-"}
                </span>

              </div>

              {/* Pickup / Drop */}
              <div className="mt-4 space-y-2">

                <p>
                  <span className="font-semibold">
                    Pickup:
                  </span>{" "}
                  {order.pickup?.address || "-"}
                </p>

                <p>
                  <span className="font-semibold">
                    Drop:
                  </span>{" "}
                  {order.drop?.address || "-"}
                </p>

              </div>

              {/* Goods Details */}
              {order.serviceType === "goods_auto" && (
                <div className="mt-4 bg-gray-50 p-4 rounded-xl">

                  <h4 className="font-bold mb-2">
                    📦 Goods Details
                  </h4>

                  <p>
                    Item:{" "}
                    {order.goods?.itemType || "-"}
                  </p>

                  <p>
                    Weight:{" "}
                    {order.goods?.estimatedWeight ?? 0} kg
                  </p>

                  <p>
                    Helpers:{" "}
                    {order.goods?.helpersRequired ?? 0}
                  </p>

                  <p>
                    Loading:{" "}
                    {order.goods?.loadingRequired
                      ? "Required"
                      : "Not Required"}
                  </p>

                  <p>
                    Unloading:{" "}
                    {order.goods?.unloadingRequired
                      ? "Required"
                      : "Not Required"}
                  </p>

                  {order.goods?.instructions && (
                    <p className="mt-2">
                      Instructions:{" "}
                      {order.goods.instructions}
                    </p>
                  )}

                </div>
              )}

            </div>
          ))}

        </div>
      )}

    </div>
  );
}


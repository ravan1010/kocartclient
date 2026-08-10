import { useEffect, useState } from "react";
import api from "../api";

export default function AutoOrders() {
  const [orders, setOrders] = useState();

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
          setOrders(res.data.orders);
        }

      } catch (error) {
        console.error(error);
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
      ) : (
        <div className="space-y-4">

          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white border rounded-2xl p-5 shadow-sm"
            >

              <div className="flex justify-between">

                <div>
                  <h3 className="font-bold">
                    {order.orderType === "passenger"
                      ? "🚗 Passenger Auto"
                      : "📦 Goods Auto"}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {new Date(
                      order.createdAt
                    ).toLocaleDateString()}
                  </p>
                </div>

                <span className="font-semibold">
                  {order.status}
                </span>

              </div>

              <div className="mt-3">
                <p>
                  Pickup:{" "}
                  {order.pickup?.address || "-"}
                </p>

                <p>
                  Drop:{" "}
                  {order.drop?.address || "-"}
                </p>
              </div>

              {order.orderType === "goods" && (
                <div className="mt-3 bg-gray-50 p-3 rounded-xl">
                  <p>
                    Item:{" "}
                    {order.goods?.itemType || "-"}
                  </p>

                  <p>
                    Weight:{" "}
                    {order.goods?.estimatedWeight || 0} kg
                  </p>

                  <p>
                    Helpers:{" "}
                    {order.goods?.helpersRequired || 0}
                  </p>
                </div>
              )}

            </div>
          ))}

        </div>
      )}

    </div>
  );
}
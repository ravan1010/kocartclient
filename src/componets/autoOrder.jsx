import { useEffect, useState } from "react";
import api from "../api";

export default function AutoOrders() {
  const [orders, setOrders] = useState([]);

  const [year, setYear] = useState(
    new Date().getFullYear()
  );

  const [month, setMonth] = useState(
    new Date().getMonth() + 1
  );

  const [loading, setLoading] = useState(false);

  const months = [
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
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);

        const res = await api.get(
          `/api/auto/orders/monthly?year=${year}&month=${month}`
        );

        if (res.data.success) {
          const goodsOrders =
            res.data.goodsOrders || [];

          setOrders(goodsOrders);
        } else {
          setOrders([]);
        }

      } catch (error) {
        console.error(
          "Failed to fetch orders:",
          error
        );

        setOrders([]);

      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [year, month]);


  const getStatusStyle = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-50 text-green-700";

      case "cancelled":
        return "bg-red-50 text-red-600";

      case "driver_assigned":
        return "bg-indigo-50 text-indigo-700";

      default:
        return "bg-yellow-50 text-yellow-700";
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-5xl mx-auto px-4 sm:px-5 py-6">

        {/* ================= HEADER ================= */}

        <div className="mb-6">

          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            My Goods Auto Orders
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            View your goods auto orders by month
          </p>

        </div>


        {/* ================= MONTH / YEAR ================= */}

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">

          <div className="flex flex-col sm:flex-row gap-3">

            {/* MONTH */}

            <div className="flex-1">

              <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                Month
              </label>

              <select
                value={month}
                onChange={(e) =>
                  setMonth(Number(e.target.value))
                }
                className="
                  w-full
                  border
                  border-gray-200
                  bg-gray-50
                  rounded-xl
                  px-4
                  py-3
                  text-sm
                  font-semibold
                  text-gray-800
                  outline-none
                  focus:ring-2
                  focus:ring-indigo-500
                  focus:border-indigo-500
                "
              >
                {months.map((name, index) => (
                  <option
                    key={index}
                    value={index + 1}
                  >
                    {name}
                  </option>
                ))}
              </select>

            </div>


            {/* YEAR */}

            <div className="flex-1">

              <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                Year
              </label>

              <select
                value={year}
                onChange={(e) =>
                  setYear(Number(e.target.value))
                }
                className="
                  w-full
                  border
                  border-gray-200
                  bg-gray-50
                  rounded-xl
                  px-4
                  py-3
                  text-sm
                  font-semibold
                  text-gray-800
                  outline-none
                  focus:ring-2
                  focus:ring-indigo-500
                  focus:border-indigo-500
                "
              >
                {[2026, 2025, 2024].map((y) => (
                  <option
                    key={y}
                    value={y}
                  >
                    {y}
                  </option>
                ))}
              </select>

            </div>

          </div>

        </div>


        {/* ================= LOADING ================= */}

        {loading && (

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">

            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600" />

            <p className="text-sm font-medium text-gray-500">
              Loading orders...
            </p>

          </div>

        )}


        {/* ================= EMPTY ================= */}

        {!loading && orders.length === 0 && (

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center">

            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-3xl">
              📦
            </div>

            <h3 className="text-lg font-bold text-gray-800">
              No goods auto orders found
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              You don't have any goods auto orders for this month.
            </p>

          </div>

        )}


        {/* ================= ORDERS ================= */}

        {!loading && orders.length > 0 && (

          <div className="space-y-4">

            {orders.map((order) => {

              const statusStyle =
                getStatusStyle(order.status);

              const vehicleName =
                order.serviceType === "4_wheel_goods_auto"
                  ? "4 Wheel Goods Auto"
                  : "Goods Auto";

              return (

                <div
                  key={order._id}
                  className="
                    overflow-hidden
                    bg-white
                    border
                    border-gray-100
                    rounded-2xl
                    shadow-sm
                    hover:shadow-md
                    transition-shadow
                  "
                >

                  <div className="p-5">

                    {/* ================= ORDER HEADER ================= */}

                    <div className="flex items-start justify-between gap-4">

                      <div className="flex items-center gap-3 min-w-0">

                        <div
                          className="
                            flex
                            h-12
                            w-12
                            shrink-0
                            items-center
                            justify-center
                            rounded-2xl
                            text-xl
                            bg-orange-50
                          "
                        >
                          📦
                        </div>


                        <div className="min-w-0">

                          <h3 className="font-extrabold text-gray-900">
                            {vehicleName}
                          </h3>

                          <p className="mt-0.5 text-xs text-gray-500">

                            {order.createdAt
                              ? new Date(
                                order.createdAt
                              ).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )
                              : "-"}

                          </p>

                        </div>

                      </div>


                      {/* STATUS */}

                      <span
                        className={`
                          shrink-0
                          rounded-full
                          px-3
                          py-1.5
                          text-xs
                          font-bold
                          capitalize
                          ${statusStyle}
                        `}
                      >
                        {order.status || "-"}
                      </span>

                    </div>


                    {/* ================= LOCATIONS ================= */}

                    <div className="mt-5 rounded-2xl bg-gray-50 border border-gray-100 p-4">

                      {/* PICKUP */}

                      <div className="flex gap-3">

                        <div className="flex flex-col items-center">

                          <div className="h-3 w-3 rounded-full bg-green-500 ring-4 ring-green-100" />

                          <div className="w-px flex-1 bg-gray-300 my-1.5" />

                        </div>


                        <div className="min-w-0 pb-3">

                          <p className="text-xs font-semibold text-green-600">
                            PICKUP
                          </p>

                          <p className="mt-1 text-sm font-medium text-gray-800">
                            {order.pickup?.address || "-"}
                          </p>

                        </div>

                      </div>


                      {/* DROP */}

                      <div className="flex gap-3">

                        <div className="flex items-start justify-center pt-1">

                          <div className="h-3 w-3 rounded-full bg-red-500 ring-4 ring-red-100" />

                        </div>


                        <div className="min-w-0">

                          <p className="text-xs font-semibold text-red-600">
                            DROP
                          </p>

                          <p className="mt-1 text-sm font-medium text-gray-800">
                            {order.drop?.address || "-"}
                          </p>

                        </div>

                      </div>

                    </div>


                    {/* ================= GOODS DETAILS ================= */}

                    <div className="mt-4 rounded-2xl border border-orange-100 bg-orange-50/50 p-4">

                      <div className="flex items-center gap-2 mb-4">

                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100">
                          📦
                        </div>

                        <h4 className="font-extrabold text-gray-900">
                          Goods Details
                        </h4>

                      </div>


                      {/* DETAILS GRID */}

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

                        {/* ITEM */}

                        <div className="rounded-xl bg-white border border-gray-100 p-3">

                          <p className="text-[11px] font-semibold uppercase text-gray-400">
                            Item
                          </p>

                          <p className="mt-1 text-sm font-bold text-gray-800">
                            {order.goods?.itemType || "-"}
                          </p>

                        </div>


                        {/* WEIGHT */}

                        <div className="rounded-xl bg-white border border-gray-100 p-3">

                          <p className="text-[11px] font-semibold uppercase text-gray-400">
                            Weight
                          </p>

                          <p className="mt-1 text-sm font-bold text-gray-800">
                            {order.goods?.estimatedWeight ?? 0} kg
                          </p>

                        </div>


                        {/* HELPERS */}

                        <div className="rounded-xl bg-white border border-gray-100 p-3">

                          <p className="text-[11px] font-semibold uppercase text-gray-400">
                            Helpers
                          </p>

                          <p className="mt-1 text-sm font-bold text-gray-800">
                            {order.goods?.helpersRequired ?? 0}
                          </p>

                        </div>


                        {/* LOADING */}

                        <div className="rounded-xl bg-white border border-gray-100 p-3">

                          <p className="text-[11px] font-semibold uppercase text-gray-400">
                            Loading
                          </p>

                          <p
                            className={`
                              mt-1
                              text-sm
                              font-bold
                              ${order.goods?.loadingRequired
                                ? "text-green-600"
                                : "text-gray-500"
                              }
                            `}
                          >
                            {order.goods?.loadingRequired
                              ? "Required"
                              : "No"}
                          </p>

                        </div>

                      </div>


                      {/* UNLOADING */}

                      <div className="mt-3 flex items-center justify-between rounded-xl bg-white border border-gray-100 px-3 py-3">

                        <span className="text-sm font-medium text-gray-500">
                          Unloading
                        </span>

                        <span
                          className={`
                            text-sm
                            font-bold
                            ${order.goods?.unloadingRequired
                              ? "text-green-600"
                              : "text-gray-500"
                            }
                          `}
                        >
                          {order.goods?.unloadingRequired
                            ? "Required"
                            : "Not Required"}
                        </span>

                      </div>


                      {/* INSTRUCTIONS */}

                      {order.goods?.instructions && (

                        <div className="mt-3 rounded-xl bg-white border border-gray-100 p-3">

                          <p className="text-[11px] font-semibold uppercase text-gray-400">
                            Instructions
                          </p>

                          <p className="mt-1 text-sm text-gray-700">
                            {order.goods.instructions}
                          </p>

                        </div>

                      )}

                    </div>

                    {/* ================= DRIVER RATING ================= */}

                    {order.status === "completed" && (
                      <div className="mt-4 rounded-2xl border border-yellow-100 bg-yellow-50/50 p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-semibold uppercase text-gray-400">
                              Delivery Partner Rating
                            </p>

                            {order.rating ? (
                              <div className="mt-2 flex items-center gap-2">
                                <div className="flex items-center">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                      key={star}
                                      className={`text-xl ${star <= order.rating
                                          ? "text-yellow-400"
                                          : "text-gray-300"
                                        }`}
                                    >
                                      ★
                                    </span>
                                  ))}
                                </div>

                                <span className="text-sm font-bold text-gray-700">
                                  {order.rating}/5
                                </span>
                              </div>
                            ) : (
                              <p className="mt-2 text-sm font-medium text-gray-500">
                                Not rated yet
                              </p>
                            )}
                          </div>

                          {order.rating && (
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
                              <span className="text-2xl">⭐</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                  </div>


                  {/* ================= FOOTER ================= */}

                  <div className="border-t border-gray-100 bg-gray-50 px-5 py-3">

                    <div className="flex items-center justify-between">

                      <span className="text-xs font-medium text-gray-400">
                        Order ID
                      </span>

                      <span className="text-xs font-bold text-gray-600">
                        {order.orderId || order._id}
                      </span>

                    </div>

                  </div>

                </div>

              );
            })}

          </div>

        )}

      </div>

    </div>
  );
}
import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate, useParams } from "react-router-dom";


export default function GoodsAutoOrders() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
const [rating, setRating] = useState(0);
const [submittingRating, setSubmittingRating] = useState(false);
const [ratingSubmitted, setRatingSubmitted] = useState(false);


  const fetchOrders = async () => {
    try {
      const res = await api.get(`/api/goods-auto/order/${orderId}`);

      // cancelled
      if (!res.data.order) {
        navigate("/", {
          replace: true,
        });
        return;
      }

      setOrder(res.data.order);
      console.log(res.data.order)

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
  }, [orderId]);

  const assignDriver = async (driverId) => {
    try {
      setLoading(true);

      const response = await api.post(
        "/api/partner/driver/assign",
        {
          orderId: order._id,
          driverId,
        }
      );

      if (response.data.success) {
        // Refresh order
        fetchOrders();
      }

    } catch (error) {
      console.error("Assign driver error:", error);
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async () => {
    try {
      setLoading(true);

      const res = await api.post(
        `/api/parcel/cancel-order/${order._id}`,
        {},
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        // Clear current order
        setOrder(null);

        // Optional: go back to booking page
        navigate("/");
      }

    } catch (error) {
      console.error("Cancel order error:", error);

      alert(
        error.response?.data?.message ||
        "Unable to cancel order"
      );
    } finally {
      setLoading(false);
    }
  };

  const submitRating = async () => {
  if (!rating) {
    alert("Please select a rating");
    return;
  }

  try {
    setSubmittingRating(true);

    const res = await api.post(
      `/api/partner/rating`,
      {
        orderId: order._id,
        partnerId: order.driver,
        rating
      },
      {
        withCredentials: true,
      }
    );

    if (res.data.success) {
      setRatingSubmitted(true);
    }
  } catch (error) {
    console.error("Rating submit error:", error);

    alert(
      error.response?.data?.message ||
        "Unable to submit rating"
    );
  } finally {
    setSubmittingRating(false);
  }
};


  if (loading) return <p>Loading...</p>;

  if (!order) {
    return null;
  }

  


  return (
    <div className="space-y-4">
      {order.status === "pending" && (
        <>
          {/* Searching */}
          {order?.selectDriver?.length === 0 && (
            <div className="flex min-h-[60vh] items-center justify-center px-4 py-6">

              <div className="w-full max-w-md overflow-hidden rounded-[28px] bg-white shadow-xl border border-gray-100">

                {/* Loading Section */}
                <div className="p-6 sm:p-8 text-center">

                  {/* Loader */}
                  <div className="relative mx-auto mb-6 h-20 w-20">

                    <div className="absolute inset-0 rounded-full border-4 border-indigo-100" />

                    <div className="absolute inset-0 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />

                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl">
                        🚕
                      </span>
                    </div>

                  </div>


                  {/* Title */}
                  <h2 className="text-2xl font-extrabold text-gray-900">
                    Finding a Goods Auto
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-gray-500">
                    We're looking for a nearby driver for your delivery.
                    Please wait a moment.
                  </p>


                  {/* Searching Status */}
                  <div className="mt-6 rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-4">

                    <div className="flex items-center justify-center gap-2">

                      <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-indigo-600" />

                      <p className="text-sm font-bold text-indigo-700">
                        Searching for drivers...
                      </p>

                    </div>


                    {/* Animated dots */}
                    <div className="mt-3 flex justify-center gap-1.5">

                      <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-500" />

                      <span
                        className="h-2 w-2 animate-bounce rounded-full bg-indigo-500"
                        style={{ animationDelay: "150ms" }}
                      />

                      <span
                        className="h-2 w-2 animate-bounce rounded-full bg-indigo-500"
                        style={{ animationDelay: "300ms" }}
                      />

                    </div>

                  </div>

                </div>


                {/* Bottom Action */}
                <div className="border-t border-gray-100 bg-gray-50 px-5 py-5">

                  <button
                    onClick={cancelOrder}
                    disabled={loading}
                    className="
            w-full
            h-14
            flex
            items-center
            justify-center
            gap-2
            rounded-2xl
            border
            border-red-200
            bg-red-50
            text-red-600
            font-bold
            shadow-sm
            hover:bg-red-100
            hover:border-red-300
            active:scale-[0.98]
            disabled:cursor-not-allowed
            disabled:opacity-50
            transition-all
            duration-200
          "
                  >

                    {loading ? (
                      <>
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-red-300 border-t-red-600" />

                        <span>
                          Cancelling...
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-lg">
                          ✕
                        </span>

                        <span>
                          Cancel Order
                        </span>
                      </>
                    )}

                  </button>

                  <p className="mt-3 text-center text-xs text-gray-400">
                    You can cancel while we are searching for a driver.
                  </p>

                </div>

              </div>

            </div>
          )}

          {/* Drivers found */}
          {order?.selectDriver?.length > 0 && (
            <div className="min-h-[60vh] bg-gray-50 px-4 py-6">

              <div className="mx-auto max-w-xl">

                {/* ================= HEADER ================= */}
                <div className="mb-6">

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-100 text-xl">
                      🚚
                    </div>

                    <div>
                      <h2 className="text-2xl font-extrabold text-gray-900">
                        Goods Auto Available
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        Choose the driver and amount you prefer.
                      </p>
                    </div>

                  </div>

                  {/* Available count */}
                  <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">

                    <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />

                    {order.selectDriver.length} driver
                    {order.selectDriver.length > 1 ? "s" : ""} available

                  </div>

                </div>


                {/* ================= DRIVER LIST ================= */}
                <div className="space-y-4">

                  {order.selectDriver.map((item, index) => (

                    <div
                      key={item.driver?._id || index}
                      className="
              overflow-hidden
              rounded-[24px]
              border
              border-gray-100
              bg-white
              shadow-md
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:shadow-lg
            "
                    >

                      {/* Card Top */}
                      <div className="p-5">

                        <div className="flex items-center justify-between gap-4">

                          {/* Driver */}
                          <div className="flex items-center gap-3 min-w-0">

                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-xl">
                              🚚
                            </div>

                            <div className="min-w-0">

                              <p className="text-xs font-medium text-gray-400">
                                Driver
                              </p>

                              <p className="mt-0.5 truncate font-bold text-gray-900">
                                {item.driver?.vehicalName || "Goods Auto Driver"}
                              </p>

                              {/* Rating */}
                              <div className="mt-1 flex items-center gap-1.5">

                                <span className="text-sm text-yellow-400">
                                  ★
                                </span>

                                <span className="text-sm font-bold text-gray-800">
                                  {item.driver?.rating?.average
                                    ? Number(item.driver.rating.average).toFixed(1)
                                    : "New"}
                                </span>

                                {item.driver?.rating?.count > 0 && (
                                  <span className="text-xs text-gray-400">
                                    ({item.driver.rating.count})
                                  </span>
                                )}

                              </div>

                            </div>

                          </div>


                          {/* Amount */}
                          <div className="shrink-0 text-right">

                            <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                              Amount
                            </p>

                            <p className="mt-0.5 text-2xl font-black text-green-600">
                              ₹{Number(item.amount || 0).toFixed(0)}
                            </p>

                          </div>

                        </div>


                        {/* Divider */}
                        <div className="my-5 border-t border-gray-100" />


                        {/* Distance / ETA */}
                        <div className="grid grid-cols-2 gap-3">

                          {/* Distance */}
                          <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">

                            <div className="flex items-center justify-center gap-1.5">

                              <span className="text-sm">
                                📍
                              </span>

                              <p className="text-xs font-semibold text-blue-500">
                                Distance
                              </p>

                            </div>

                            <p className="mt-1 text-center text-lg font-extrabold text-gray-900">
                              {item.DistanceKm != null
                                ? `${Number(item.DistanceKm).toFixed(1)} km`
                                : "--"}
                            </p>

                          </div>


                          {/* ETA */}
                          <div className="rounded-2xl border border-orange-100 bg-orange-50 p-4">

                            <div className="flex items-center justify-center gap-1.5">

                              <span className="text-sm">
                                🕐
                              </span>

                              <p className="text-xs font-semibold text-orange-500">
                                Arrival
                              </p>

                            </div>

                            <p className="mt-1 text-center text-lg font-extrabold text-gray-900">
                              {item.EtaMinutes != null
                                ? `${item.EtaMinutes} min`
                                : "--"}
                            </p>

                          </div>

                        </div>


                        {/* Assign Button */}
                        <button
                          onClick={() => assignDriver(item.driver)}
                          disabled={!item.driver || loading}
                          className="
                  mt-5
                  flex
                  h-14
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-2xl
                  bg-indigo-600
                  text-sm
                  font-extrabold
                  text-white
                  shadow-sm
                  shadow-indigo-200
                  transition-all
                  duration-200
                  hover:bg-indigo-700
                  hover:shadow-md
                  active:scale-[0.98]
                  disabled:cursor-not-allowed
                  disabled:bg-gray-300
                  disabled:shadow-none
                "
                        >

                          {loading ? (
                            <>
                              <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                              Assigning...
                            </>
                          ) : (
                            <>
                              <span className="text-lg">
                                ✓
                              </span>

                              <span>
                                Assign This Driver
                              </span>
                            </>
                          )}

                        </button>

                      </div>

                    </div>

                  ))}

                </div>


                {/* ================= CANCEL ================= */}
                <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">

                  <p className="mb-3 text-center text-xs text-gray-400">
                    Don't want to choose a driver?
                  </p>

                  <button
                    onClick={cancelOrder}
                    disabled={loading}
                    className="
            flex
            h-14
            w-full
            items-center
            justify-center
            gap-2
            rounded-2xl
            border
            border-red-200
            bg-red-50
            text-red-600
            font-bold
            shadow-sm
            transition-all
            duration-200
            hover:border-red-300
            hover:bg-red-100
            active:scale-[0.98]
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
                  >

                    {loading ? (
                      <>
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-red-300 border-t-red-600" />

                        <span>
                          Cancelling...
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="text-lg">
                          ✕
                        </span>

                        <span>
                          Cancel Order
                        </span>
                      </>
                    )}

                  </button>

                </div>

              </div>

            </div>
          )}
        </>
      )}

      {order.status === "driver_assigned" && (
        <div className="min-h-[60vh] bg-gray-50 flex items-center justify-center px-4 py-6">

          <div className="w-full max-w-md overflow-hidden rounded-[28px] bg-white shadow-xl border border-gray-100">

            {/* ================= HEADER ================= */}
            <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-600 px-5 sm:px-6 py-6 text-white">

              {/* Decorative background */}
              <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-white/10" />
              <div className="absolute -left-12 -bottom-16 w-40 h-40 rounded-full bg-white/5" />

              <div className="relative flex items-start justify-between gap-4">

                {/* Title */}
                <div className="min-w-0">

                  <div className="flex items-center gap-2">

                    <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center">
                      <span className="text-xl">
                        🚕
                      </span>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-indigo-100">
                        3 wheel goods Auto
                      </p>

                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />

                        <span className="text-xs text-indigo-100">
                          Driver Assigned
                        </span>
                      </div>
                    </div>

                  </div>

                  <h2 className="mt-4 text-2xl font-extrabold">
                    Driver Assigned
                  </h2>

                  <p className="mt-1 text-sm text-indigo-100 leading-5">
                    Your driver is on the way to your pickup location.
                  </p>

                </div>


                {/* SOS */}
                <a
                  href="tel:8088303214"
                  className="
              shrink-0
              flex
              items-center
              justify-center
              gap-2
              min-w-[76px]
              h-12
              px-4
              rounded-2xl
              bg-white
              text-red-600
              font-extrabold
              text-sm
              shadow-lg
              shadow-indigo-900/20
              hover:bg-red-50
              active:scale-95
              transition-all
              duration-200
            "
                >
                  <span className="text-lg">
                    📞
                  </span>

                  <span>
                    SOS
                  </span>
                </a>

              </div>

            </div>


            {/* ================= ORDER ID ================= */}
            <div className="px-5 sm:px-6 pt-5">

              <div className="flex items-center justify-between gap-3 rounded-2xl bg-gray-50 border border-gray-100 px-4 py-4">

                <div className="min-w-0">

                  <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                    Order ID
                  </p>

                  <p className="mt-1 font-extrabold text-gray-900 truncate">
                    {order.orderId}
                  </p>

                </div>

                <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center shrink-0">
                  <span className="text-lg">
                    📋
                  </span>
                </div>

              </div>

            </div>


            {/* ================= DRIVER DETAILS ================= */}
            <div className="px-5 sm:px-6 py-6">

              <div className="flex items-center justify-between mb-4">

                <div>
                  <h3 className="text-base font-extrabold text-gray-900">
                    Driver Details
                  </h3>

                  <p className="text-xs text-gray-500 mt-1">
                    Your assigned driver information
                  </p>
                </div>

                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                  👤
                </div>

              </div>


              <div className="space-y-3">

                {/* Driver */}
                <div className="flex items-center gap-3 rounded-2xl bg-gray-50 border border-gray-100 p-3">

                  <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-xl shrink-0">
                    👤
                  </div>

                  <div className="min-w-0">

                    <p className="text-xs text-gray-400">
                      Driver
                    </p>

                    <p className="font-bold text-gray-900 truncate">
                      {order.driver?.name}
                    </p>

                  </div>

                </div>


                {/* Phone */}
                <a
                  href={`tel:${order.driver?.number}`}
                  className="
              flex
              items-center
              justify-between
              gap-3
              rounded-2xl
              bg-gray-50
              border
              border-gray-100
              p-3
              hover:bg-green-50
              hover:border-green-100
              transition-all
            "
                >

                  <div className="flex items-center gap-3">

                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-xl shrink-0">
                      📞
                    </div>

                    <div>

                      <p className="text-xs text-gray-400">
                        Phone
                      </p>

                      <p className="font-bold text-green-600">
                        {order.driver?.number}
                      </p>

                    </div>

                  </div>

                  <span className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    →
                  </span>

                </a>


                {/* Vehicle */}
                <div className="flex items-center justify-between gap-3 rounded-2xl bg-gray-50 border border-gray-100 p-3">

                  <div className="flex items-center gap-3">

                    <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-xl shrink-0">
                      🚕
                    </div>

                    <div>

                      <p className="text-xs text-gray-400">
                        Vehicle
                      </p>

                      <p className="font-bold text-gray-900">
                        {order.driver?.vehicleName}
                      </p>

                      <p className="text-xs text-gray-500 mt-0.5">
                        {order.driver?.vehicleNo}
                      </p>

                    </div>

                  </div>

                  <span className="px-2.5 py-1.5 rounded-lg bg-gray-900 text-white text-[10px] font-bold tracking-wide">
                    AUTO
                  </span>

                </div>

              </div>

            </div>


            {/* ================= ETA ================= */}
            <div className="px-5 sm:px-6 pb-6">

              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 p-6 text-center">

                {/* Decorative circle */}
                <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-indigo-100/70" />

                <div className="relative">

                  <div className="mx-auto w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-2xl mb-3">
                    🕐
                  </div>

                  <p className="text-sm font-bold text-indigo-600">
                    Driver is on the way
                  </p>

                  <p className="mt-1 text-3xl font-black text-indigo-950">
                    {order.driverEtaMinutes}
                    <span className="text-lg font-bold ml-1">
                      min
                    </span>
                  </p>

                  <p className="mt-1 text-xs text-indigo-500">
                    Estimated arrival time
                  </p>

                  {order.driverDistanceKm != null && (
                    <div className="inline-flex items-center gap-1.5 mt-4 px-3 py-1.5 rounded-full bg-white/80 border border-indigo-100 text-xs font-semibold text-gray-600">
                      📍 {order.driverDistanceKm} km away
                    </div>
                  )}

                </div>

              </div>

            </div>

          </div>

        </div>
      )}

      {/* Driver Details */}
      {(
        order.status === "driver_arrived" ||
        order.status === "picked_up"
      ) && (
          <div className="mt-5 overflow-hidden rounded-[28px] border border-gray-100 bg-white shadow-lg">

            {/* ================= HEADER ================= */}
            <div
              className={`relative overflow-hidden px-5 sm:px-6 py-5 text-white ${order.status === "driver_arrived"
                ? "bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-600"
                : "bg-gradient-to-br from-green-600 via-green-600 to-emerald-500"
                }`}
            >

              {/* Decorative circles */}
              <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/10" />
              <div className="absolute -left-12 -bottom-16 h-32 w-32 rounded-full bg-white/5" />

              <div className="relative flex items-start justify-between gap-4">

                {/* Title */}
                <div className="min-w-0">

                  <div className="flex items-center gap-2">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                      <span className="text-xl">
                        🚕
                      </span>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-white/70">
                        Driver Details
                      </p>

                      <div className="mt-1 flex items-center gap-1.5">

                        <span className="h-2 w-2 animate-pulse rounded-full bg-white" />

                        <span className="text-xs font-medium text-white/80">
                          {order.status === "driver_arrived"
                            ? "Driver Arrived"
                            : "Ride in Progress"}
                        </span>

                      </div>
                    </div>

                  </div>

                  <h3 className="mt-4 text-xl font-extrabold">
                    {order.status === "driver_arrived"
                      ? "Your driver has arrived"
                      : "Your ride is in progress"}
                  </h3>

                </div>


                {/* SOS */}
                <a
                  href="tel:8088303214"
                  className="
            shrink-0
            flex
            h-11
            min-w-[72px]
            items-center
            justify-center
            gap-2
            rounded-2xl
            bg-white
            px-3
            text-sm
            font-extrabold
            text-red-600
            shadow-lg
            shadow-black/10
            transition-all
            duration-200
            hover:bg-red-50
            active:scale-95
          "
                >
                  <span className="text-base">
                    📞
                  </span>

                  <span>
                    SOS
                  </span>
                </a>

              </div>

            </div>


            {/* ================= DRIVER INFORMATION ================= */}
            <div className="p-5 sm:p-6">

              <div className="space-y-3">

                {/* Name */}
                <div className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-3">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-lg">
                    👤
                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="text-xs text-gray-400">
                      Name
                    </p>

                    <p className="mt-0.5 truncate font-bold text-gray-900">
                      {order.driver?.name}
                    </p>

                  </div>

                </div>


                {/* Phone */}
                <a
                  href={`tel:${order.driver?.number}`}
                  className="
            flex
            items-center
            justify-between
            gap-3
            rounded-2xl
            border
            border-gray-100
            bg-gray-50
            p-3
            transition-all
            duration-200
            hover:border-green-200
            hover:bg-green-50
            active:scale-[0.99]
          "
                >

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-100 text-lg">
                      📞
                    </div>

                    <div>

                      <p className="text-xs text-gray-400">
                        Phone
                      </p>

                      <p className="mt-0.5 font-bold text-green-600">
                        {order.driver?.number}
                      </p>

                    </div>

                  </div>

                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 text-green-600">
                    →
                  </div>

                </a>


                {/* Vehicle */}
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-3">

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-lg">
                      🚕
                    </div>

                    <div>

                      <p className="text-xs text-gray-400">
                        Vehicle
                      </p>

                      <p className="mt-0.5 font-bold text-gray-900">
                        {order.driver?.vehicleName}
                      </p>

                    </div>

                  </div>

                </div>


                {/* Vehicle Number */}
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-3">

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-200 text-lg">
                      🔢
                    </div>

                    <div>

                      <p className="text-xs text-gray-400">
                        Vehicle No.
                      </p>

                      <p className="mt-0.5 font-bold text-gray-900">
                        Vehicle Registration
                      </p>

                    </div>

                  </div>

                  <span className="shrink-0 rounded-xl bg-gray-900 px-3 py-2 text-xs font-extrabold tracking-wider text-white">
                    {order.driver?.vehicleNo}
                  </span>

                </div>


                {/* Amount */}
                <div className="flex items-center justify-between gap-3 rounded-2xl border border-yellow-100 bg-gradient-to-r from-yellow-50 to-amber-50 p-4">

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-yellow-100 text-lg">
                      ₹
                    </div>

                    <div>

                      <p className="text-xs text-gray-500">
                        Ride Amount
                      </p>

                      <p className="mt-0.5 text-sm font-semibold text-gray-700">
                        Total fare
                      </p>

                    </div>

                  </div>

                  <span className="text-2xl font-black text-yellow-700">
                    ₹{order.amount}
                  </span>

                </div>

              </div>


              {/* ================= PICKUP OTP ================= */}
              {order.status === "driver_arrived" && (
                <div className="relative mt-5 overflow-hidden rounded-3xl border border-dashed border-indigo-300 bg-gradient-to-br from-indigo-50 to-violet-50 p-6 text-center">

                  <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-indigo-100/60" />

                  <div className="relative">

                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-xl">
                      🔐
                    </div>

                    <p className="text-xs font-bold uppercase tracking-wider text-indigo-500">
                      Pickup OTP
                    </p>

                    <p className="mt-3 rounded-2xl bg-white px-4 py-3 text-4xl font-black tracking-[0.35em] text-indigo-950 shadow-sm">
                      {order.otp?.pickupOtp}
                    </p>

                    <p className="mt-3 text-xs font-medium text-indigo-600">
                      Share this OTP with your driver
                    </p>

                  </div>

                </div>
              )}


              {/* ================= DELIVERY OTP ================= */}
              {order.status === "picked_up" && (
                <div className="relative mt-5 overflow-hidden rounded-3xl border border-dashed border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 p-6 text-center">

                  <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-green-100/60" />

                  <div className="relative">

                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-xl">
                      🔐
                    </div>

                    <p className="text-xs font-bold uppercase tracking-wider text-green-600">
                      Delivery OTP
                    </p>

                    <p className="mt-3 rounded-2xl bg-white px-4 py-3 text-4xl font-black tracking-[0.35em] text-green-950 shadow-sm">
                      {order.otp?.deliveryOtp}
                    </p>

                    <p className="mt-3 text-xs font-medium text-green-600">
                      Share this OTP with your driver at the destination
                    </p>

                  </div>

                </div>
              )}

            </div>

          </div>
        )}

      
      {order.status === "completed" && (
        <div className="min-h-[70vh] bg-gray-50 px-4 py-8 flex items-center justify-center">

          <div className="w-full max-w-md overflow-hidden rounded-[28px] bg-white border border-gray-100 shadow-xl">

            {/* Header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-green-600 via-green-600 to-emerald-500 px-6 py-8 text-center text-white">

              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10" />
              <div className="absolute -left-12 -bottom-16 h-40 w-40 rounded-full bg-white/5" />

              <div className="relative">

                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg">

                  <span className="text-4xl">
                    ✓
                  </span>

                </div>

                <h2 className="mt-5 text-2xl font-black">
                  Delivery Completed
                </h2>

                <p className="mt-2 text-sm text-green-100">
                  Your goods auto delivery has been completed successfully.
                </p>

              </div>

            </div>


            {/* Content */}
            <div className="p-6">

              {!ratingSubmitted && !order.rating?.rating ? (
                <>
                  {/* Rating title */}
                  <div className="text-center">

                    <h3 className="text-xl font-extrabold text-gray-900">
                      Rate your driver
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      How was your delivery experience?
                    </p>

                  </div>


                  {/* Stars */}
                  <div className="mt-6 flex justify-center gap-2">

                    {[1, 2, 3, 4, 5].map((star) => (

                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`
                          flex h-12 w-12 items-center justify-center
                          rounded-xl text-3xl transition-all
                          ${
                            star <= rating
                              ? "bg-yellow-50 text-yellow-400 scale-110"
                              : "bg-gray-50 text-gray-300"
                          }
                        `}
                      >
                        ★
                      </button>

                    ))}

                  </div>


                  {/* Rating text */}
                  <div className="mt-3 text-center">

                    {rating > 0 && (
                      <p className="text-sm font-bold text-gray-700">
                        {rating === 5 && "Excellent! 😍"}
                        {rating === 4 && "Very Good! 😊"}
                        {rating === 3 && "Good 👍"}
                        {rating === 2 && "Could be better 😐"}
                        {rating === 1 && "Poor 😞"}
                      </p>
                    )}

                  </div>


                  {/* Submit */}
                  <button
                    onClick={submitRating}
                    disabled={!rating || submittingRating}
                    className="
                      mt-5 flex h-14 w-full
                      items-center justify-center gap-2
                      rounded-2xl
                      bg-indigo-600
                      text-sm font-extrabold text-white
                      shadow-lg shadow-indigo-200
                      transition-all
                      hover:bg-indigo-700
                      active:scale-[0.98]
                      disabled:cursor-not-allowed
                      disabled:bg-gray-300
                      disabled:shadow-none
                    "
                  >

                    {submittingRating ? (
                      <>
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <span className="text-lg">
                          ⭐
                        </span>

                        Submit Rating
                      </>
                    )}

                  </button>


                  {/* Skip */}
                  <button
                    onClick={() => setRatingSubmitted(true)}
                    disabled={submittingRating}
                    className="
                      mt-3 w-full py-3
                      text-sm font-semibold
                      text-gray-400
                      hover:text-gray-600
                    "
                  >
                    Skip for now
                  </button>
                  <button
                  onClick={() => navigate("/")}
                  className="
                    mt-5 flex h-14 w-full
                    items-center justify-center gap-2
                    rounded-2xl
                    bg-gray-900
                    text-sm font-extrabold text-white
                    shadow-lg
                    transition-all
                    hover:bg-gray-800
                    active:scale-[0.98]
                  "
                >
                  <span className="text-lg">
                    🏠
                  </span>

                  <span>
                    Go to Home
                  </span>
                </button>

                </>
              ) : (
                <>
                  {/* Rating submitted */}
                  <div className="py-5 text-center">

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">

                      <span className="text-3xl">
                        ✓
                      </span>

                    </div>

                    <h3 className="mt-5 text-xl font-extrabold text-gray-900">
                      Thank you!
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                      Your feedback helps us improve our delivery service.
                    </p>

                    {/* Show selected stars */}
                    <div className="mt-5 flex justify-center gap-1">

                      {[1, 2, 3, 4, 5].map((star) => (

                        <span
                          key={star}
                          className={`
                            text-3xl
                            ${
                              star <=
                              (rating || order.rating?.rating || 0)
                                ? "text-yellow-400"
                                : "text-gray-200"
                            }
                          `}
                        >
                          ★
                        </span>

                      ))}

                    </div>

                  </div>

                </>
              )}


              {/* Home button */}
              {(ratingSubmitted || order.rating?.rating) && (
                <button
                  onClick={() => navigate("/")}
                  className="
                    mt-5 flex h-14 w-full
                    items-center justify-center gap-2
                    rounded-2xl
                    bg-gray-900
                    text-sm font-extrabold text-white
                    shadow-lg
                    transition-all
                    hover:bg-gray-800
                    active:scale-[0.98]
                  "
                >
                  <span className="text-lg">
                    🏠
                  </span>

                  <span>
                    Go to Home
                  </span>
                </button>
              )}

            </div>

          </div>

        </div>
      )}
  
    </div>
  );
}
import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate, useParams } from "react-router-dom";


export default function GoodsAutoOrders() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true); 


  const fetchOrders = async () => {
    try {
      const res = await api.get(`/api/goods-auto/order/${orderId}`);

      // completed / cancelled
      if (!res.data.order) {
        navigate("/goods-auto", {
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
      "/api/driver/assign",
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
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg border border-gray-100">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900">
            Finding a goods auto
          </h2>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            We're looking for a nearby driver for your ride.
            Please wait a moment.
          </p>

          <div className="mt-6 rounded-xl bg-gray-50 px-4 py-3">
            <p className="text-sm font-medium text-gray-700">
              Searching for drivers...
            </p>

            <div className="mt-2 flex justify-center gap-1">
              <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-500"></span>
              <span
                className="h-2 w-2 animate-bounce rounded-full bg-indigo-500"
                style={{ animationDelay: "150ms" }}
              ></span>
              <span
                className="h-2 w-2 animate-bounce rounded-full bg-indigo-500"
                style={{ animationDelay: "300ms" }}
              ></span>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* Drivers found */}
    {order?.selectDriver?.length > 0  && (
      <div className="min-h-[60vh] bg-gray-50 px-4 py-6">
        <div className="mx-auto max-w-xl">

          <div className="mb-5">
            <h2 className="text-2xl font-bold text-gray-900">
              Goods Auto Available
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Choose the driver and amount you prefer.
            </p>
          </div>

          <div className="space-y-4">
            {order?.selectDriver?.map((item, index) => (
              <div
                key={item.driver?._id || index}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                {/* Driver */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-lg font-bold text-indigo-600">
                      {item.driver?.name?.charAt(0)?.toUpperCase() || "D"}
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      Driver Amount
                    </p>

                    <p className="text-2xl font-bold text-green-600">
                      ₹{item.amount}
                    </p>
                  </div>
                </div>

                {/* Distance / ETA */}
                <div className="mt-5 grid grid-cols-2 gap-3">

                  <div className="rounded-xl bg-gray-50 p-3 text-center">
                    <p className="text-xs text-gray-500">
                      Distance
                    </p>

                    <p className="mt-1 font-semibold text-gray-900">
                      {item.DistanceKm != null
                        ? `${Number(item.DistanceKm).toFixed(1)} km`
                        : "--"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-gray-50 p-3 text-center">
                    <p className="text-xs text-gray-500">
                      Arrival
                    </p>

                    <p className="mt-1 font-semibold text-gray-900">
                      {item.EtaMinutes != null
                        ? `${item.EtaMinutes} min`
                        : "--"}
                    </p>
                  </div>

                </div>

                {/* Assign button */}
                <button
                  onClick={() => assignDriver(item.driver?._id)}
                  disabled={!item.driver?._id}
                  className="mt-5 w-full rounded-xl bg-indigo-600 py-3.5 font-semibold text-white transition hover:bg-indigo-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  Assign This Driver
                </button>

              </div>
            ))}
          </div>

        </div>
      </div>
    )}
  </>
)}

       {order.status === "driver_assigned" && (
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-xl border border-gray-100">

            {/* Header */}
            <div className="bg-indigo-600 px-6 py-5 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-indigo-100">
                    Passenger Auto
                  </p>

                  <h2 className="mt-1 text-2xl font-bold">
                    Driver Assigned
                  </h2>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                  🚕
                </div>
              </div>

              <p className="mt-3 text-sm text-indigo-100">
                Your driver is on the way to your pickup location.
              </p>
            </div>

            {/* Order ID */}
            <div className="px-6 pt-5">
              <div className="rounded-xl bg-gray-50 px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  Order ID
                </p>

                <p className="mt-1 font-bold text-gray-800">
                  {order.orderId}
                </p>
              </div>
            </div>

            {/* Driver Details */}
            <div className="px-6 py-5">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-400">
                Driver Details
              </h3>

              <div className="space-y-4">

                {/* Driver */}
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-xl">
                    👤
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Driver
                    </p>

                    <p className="font-semibold text-gray-900">
                      {order.driver?.name}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-xl">
                    📞
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Phone
                    </p>

                    <p className="font-semibold text-gray-900">
                      {order.driver?.number}
                    </p>
                  </div>
                </div>

                {/* Vehicle */}
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-xl">
                    🚕
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Vehicle
                    </p>

                    <p className="font-semibold text-gray-900">
                      {order.driver?.vehicleName}
                    </p>

                    <p className="text-sm text-gray-500">
                      {order.driver?.vehicleNo}
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* ETA */}
            <div className="mx-6 mb-6 rounded-2xl bg-indigo-50 p-5 text-center">

              <div className="mb-2 text-3xl">
                🕐
              </div>

              <p className="text-sm font-medium text-indigo-600">
                Driver is on the way
              </p>

              <p className="mt-1 text-2xl font-bold text-indigo-900">
                {order.driverEtaMinutes} min
              </p>

              <p className="mt-1 text-xs text-indigo-600">
                Estimated arrival time
              </p>

              {order.driverDistanceKm != null && (
                <p className="mt-2 text-sm text-gray-500">
                  {order.driverDistanceKm} km away
                </p>
              )}
            </div>

          </div>
        </div>
      )}

    {/* Driver Details */}
      {(
        order.status === "driver_arrived" ||
        order.status === "picked_up"
      ) && (
          <div className="mt-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-md">

            {/* Header */}
            <div className="mb-4 flex items-center gap-3">
              {/* <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-xl">
                🚕
              </div> */}

              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Driver Details
                </h3>

                <p className="text-sm text-gray-500">
                  {order.status === "driver_arrived"
                    ? "Your driver has arrived"
                    : "Your ride is in progress"}
                </p>
              </div>
            </div>

            {/* Driver information */}
            <div className="space-y-3">

              {/* Name */}
              <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                <span className="text-sm font-medium text-gray-500">
                  Name
                </span>

                <span className="font-semibold text-gray-900">
                  {order.driver?.name}
                </span>
              </div>

              {/* Phone */}
              <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                <span className="text-sm font-medium text-gray-500">
                  Phone
                </span>

                <a
                  href={`tel:$ ${order.driver?.number}`}
                  className="font-semibold text-indigo-600 hover:text-indigo-700"
                >
                    {order.driver?.number}
                </a>
              </div>

              {/* Vehicle */}
              <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                <span className="text-sm font-medium text-gray-500">
                  Vehicle
                </span>

                <span className="font-semibold text-gray-900">
                  {order.driver?.vehicleName}
                </span>
              </div>

              {/* Vehicle Number */}
              <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                <span className="text-sm font-medium text-gray-500">
                  Vehicle No.
                </span>

                <span className="rounded-lg bg-gray-900 px-3 py-1 text-sm font-bold tracking-wide text-white">
                   {order.driver?.vehicleNo}
                </span>
              </div>

            </div>

            {/* Pickup OTP */}
            {order.status === "driver_arrived" && (
              <div className="mt-5 rounded-2xl border border-dashed border-indigo-300 bg-indigo-50 p-5 text-center">
                <p className="text-sm font-medium text-indigo-600">
                  Pickup OTP
                </p>

                <p className="mt-2 text-3xl font-extrabold tracking-[0.4em] text-indigo-900">
                  {order.otp?.pickupOtp}
                </p>

                <p className="mt-2 text-xs text-indigo-600">
                  Share this OTP with your driver
                </p>
              </div>
            )}

            {/* Delivery OTP */}
            {order.status === "picked_up" &&  (
              <div className="mt-5 rounded-2xl border border-dashed border-green-300 bg-green-50 p-5 text-center">
                <p className="text-sm font-medium text-green-600">
                  Delivery OTP
                </p>

                <p className="mt-2 text-3xl font-extrabold tracking-[0.4em] text-green-900">
                  {order.otp?.deliveryOtp}
                </p>

                <p className="mt-2 text-xs text-green-600">
                  Share this OTP with your driver at the destination
                </p>
              </div>
            )}

          </div>
        )}
</div>
  );
}
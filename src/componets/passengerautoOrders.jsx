import { useEffect, useState } from "react";
import api from "../api";

export default function PassengerAutoOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/api/passenger-auto/all/orders");
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
        <p>No Ride Orders</p>
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

            {/* <p>
              <span className="font-semibold">Fare:</span> ₹{order.amount}
            </p> */}

            <p>
              <span className="font-semibold">Passengers:</span>{" "}
              {order.passenger?.passengers}
            </p>

            {/* Driver Details */}
            {(order.status === "accepted" ||
              order.status === "driver_assigned" ||
              order.status === "picked_up") &&
              order.partner && (
                <>
                  <hr className="my-3" />

                  <h3 className="font-bold mb-2">
                    Driver Details
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
                  Share this OTP with the driver
                </p>

                <h2 className="text-3xl font-bold tracking-widest text-yellow-700">
                  {order.otp?.pickup}
                </h2>
              </div>
            )}

            {/* Ride Started */}
            {order.status === "picked_up" && (
              <div className="mt-4 rounded-xl bg-blue-100 border border-blue-400 p-4 text-center">
                <p className="text-sm">
                  🚖 Your ride is in progress.
                </p>
              </div>
            )}

            {/* Drop OTP */}
            {order.status === "picked_up" && (
              <div className="mt-4 rounded-xl bg-green-100 border border-green-400 p-4 text-center">
                <p className="text-sm text-gray-700">
                  Share this OTP when you reach your destination
                </p>

                <h2 className="text-3xl font-bold tracking-widest text-green-700">
                  {order.otp?.delivery}
                </h2>
              </div>
            )}

            {/* Completed */}
            {order.status === "completed" && (
              <div className="mt-4 rounded-xl bg-green-50 border border-green-500 p-4 text-center">
                ✅ Ride Completed
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
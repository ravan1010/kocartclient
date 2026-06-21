import React from 'react'
// import axios from 'axios';
import api from '../../api.js'
import { useState } from 'react';

const Adminorder = () => {

    // const [orders, setOrders] = useState([]);
    const [pendingOrders, setPendingOrders] = useState([]);
    const [acceptedOrders, setAcceptedOrders] = useState([]);
    const [assigned, setAssigned] = useState([]);
    const [completedOrders, setCompletedOrders] = useState([]);
    const [cancelledOrders, setCancelledOrders] = useState([]);
    const [step, setstep] = useState(1);

    const fetchOrders = async () => {
        try {
            await api.get('/api/admin/orders').then((response) => {
                console.log('Orders fetched:', response.data.pendingOrders);
                setPendingOrders(response.data.pendingOrders);
                setAcceptedOrders(response.data.acceptedOrders);
                setCompletedOrders(response.data.completedOrders);
                setCancelledOrders(response.data.cancelledOrders);
                setAssigned(response.data.assignedOrders)
            });
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    React.useEffect(() => {
        fetchOrders();
    }, []);

     const acceptOrder = async (orderId, orderstatus) => {
        try {
          await api.put(`/api/admin/order/update/${orderId}/${orderstatus}`,
            {}
          )
            .then((res) => {
              if (res.data.success) {
                alert(res.data.message)
                fetchOrders()
              }
            })
        } catch (error) {
          console.log(error);
        }
      };


  return (
   <div className="min-h-screen bg-gray-100 p-3 md:p-6">

  <div className="bg-white rounded-xl shadow p-4 mb-4">
    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
      Orders Management
    </h1>
  </div>

  {/* Tabs */}
  <div className="bg-white rounded-xl shadow p-2 mb-4 overflow-x-auto">
    <div className="flex gap-2 min-w-max">

      <button
        onClick={() => setstep(1)}
        className={`px-4 py-2 rounded-lg font-medium transition
        ${step === 1
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-700"}`}
      >
        Pending ({pendingOrders.length})
      </button>

      <button
        onClick={() => setstep(2)}
        className={`px-4 py-2 rounded-lg font-medium transition
        ${step === 2
            ? "bg-green-600 text-white"
            : "bg-gray-100 text-gray-700"}`}
      >
        Accepted ({acceptedOrders.length})
      </button>

      <button
        onClick={() => setstep(3)}
        className={`px-4 py-2 rounded-lg font-medium transition
        ${step === 3
            ? "bg-purple-600 text-white"
            : "bg-gray-100 text-gray-700"}`}
      >
        Completed ({completedOrders.length})
      </button>

      <button
        onClick={() => setstep(4)}
        className={`px-4 py-2 rounded-lg font-medium transition
        ${step === 4
            ? "bg-red-600 text-white"
            : "bg-gray-100 text-gray-700"}`}
      >
        Cancelled ({cancelledOrders.length})
      </button>

      <button
        onClick={() => setstep(5)}
        className={`px-4 py-2 rounded-lg font-medium transition
        ${step === 5
            ? "bg-green-400 text-white"
            : "bg-gray-100 text-gray-700"}`}
      >
        assigned ({assigned.length})
      </button>

    </div>
  </div>

  {/* Pending */}
  {step === 1 && (
    <div className="space-y-3">
      {pendingOrders.length > 0 ? (
        pendingOrders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-xl shadow p-4"
          >
            <div className="flex flex-col md:flex-row md:justify-between gap-3">
              <div>
                <p className="font-semibold">
                  Order ID
                </p>
                <p className="text-gray-600 break-all">
                  {order._id.slice(0, 8)}...{order._id.slice(-4)}
                  </p>
              </div>



          {/* Products */}
          <div className="mt-4 space-y-3">
            {order.shop?.map((shop) =>
              shop.items?.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-3 border rounded-lg p-3"
                >
                  {/* Image */}
                  <img
                    src={item.productId?.image?.[0]}
                                  alt={item.productId?.name || "Product"}
                                  className="w-16 h-16 rounded-lg object-cover"
                  />

                  {/* Product Details */}
                  <div className="flex-1">
                    <p className="font-semibold">
                      {item.productId?.name}
                    </p>

                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </p>

                    <p className="text-sm font-medium text-green-600">
                      ₹{item.price}
                    </p>
                  </div>

                  {/* Total */}
                  <div className="text-right">
                    <p className="font-bold">
                      ₹{item.price * item.quantity}
                    </p>
                  </div>
                </div>
              ))

            )}
            <div className="flex justify-end mt-2">
              <p className="text-lg font-bold">
                Total: ₹{order.shop?.reduce((acc, shop) => acc + shop.items.reduce((shopAcc, item) => shopAcc + (item.price * item.quantity), 0), 0)}
              </p>
              </div>
          </div>


              <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm w-fit">
                {order.status}
              </span>
            </div>

            <div className="flex gap-2 mt-4">
              <button onClick={() => acceptOrder(order._id, 'accepted' )} className="bg-green-600 text-white px-4 py-2 rounded-lg">
                Accept
              </button>

              <button onClick={() => acceptOrder(order._id, 'cancelled')} className="bg-red-600 text-white px-4 py-2 rounded-lg">
                Cancel
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="bg-white p-6 rounded-xl text-center">
          No Pending Orders
        </div>
      )}
    </div>
  )}

  {/* Accepted */}
  {step === 2 && (
    <div className="space-y-3">
      {acceptedOrders.length > 0 ? (
        acceptedOrders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-xl shadow p-4"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">Order ID</p>
                <p className="text-gray-600 break-all">
                  {order._id}
                </p>
              </div>

              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                {order.status}
              </span>
            </div>
          </div>
        ))
      ) : (
        <div className="bg-white p-6 rounded-xl text-center">
          No Accepted Orders
        </div>
      )}
    </div>
  )}

  {/* Completed */}
  {step === 3 && (
    <div className="space-y-3">
      {completedOrders.length > 0 ? (
        completedOrders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-xl shadow p-4"
          >
            <div className="flex justify-between items-center">
              <p className="break-all">{order._id}</p>

              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">
                {order.status}
              </span>
            </div>
          </div>
        ))
      ) : (
        <div className="bg-white p-6 rounded-xl text-center">
          No Completed Orders
        </div>
      )}
    </div>
  )}

  {/* Cancelled */}
  {step === 4 && (
    <div className="space-y-3">
      {cancelledOrders.length > 0 ? (
        cancelledOrders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-xl shadow p-4"
          >
            <div className="flex justify-between items-center">
              <p className="break-all">{order._id}</p>

              <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                {order.status}
              </span>
            </div>
          </div>
        ))
      ) : (
        <div className="bg-white p-6 rounded-xl text-center">
          No Cancelled Orders
        </div>
      )}
    </div>
  )}

  {/* assigned */}
  {step === 5 && (
    <div className="space-y-3">
      {assigned.length > 0 ? (
        assigned.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-xl shadow p-4"
          >
            <div className="flex justify-between items-center">
              <p className="break-all">{order._id}</p>

              <span className="bg-100-00 text-green-700 px-3 py-1 rounded-full text-sm">
                {order.status}
              </span>
            </div>
          </div>
        ))
      ) : (
        <div className="bg-white p-6 rounded-xl text-center">
          No assigned Orders
        </div>
      )}
    </div>
  )}

</div>
  )
}

export default Adminorder

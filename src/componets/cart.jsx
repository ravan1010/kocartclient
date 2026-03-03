import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./navbar";
import Footer from "./Footer";
import api from "../api";

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const getcart = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/cart/get", { withCredentials: true });
      setCart(res.data); // 👈 IMPORTANT
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getcart();
  }, []);

  const removeItem = async (itemId, shopId) => {
    try {
      await api.delete(`/api/remove/${itemId}/${shopId}`, { withCredentials: true });
      getcart(); // 🔥 no reload
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Navbar />

      <div className="mb-6 px-2 md:px-6">

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center h-[50vh]">
            <p className="text-3xl font-bold animate-pulse">Loading...</p>
          </div>
        )}

        {/* Empty Cart */}
        {!loading && (!cart || cart.shop.length === 0) && (
          <div className="flex flex-col items-center justify-center h-[50vh]">
            <p className="text-2xl font-bold text-gray-600">
              🛒 Your cart is empty
            </p>
            <Link
              to="/"
              className="mt-4 px-6 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700"
            >
              Continue Shopping
            </Link>
          </div>
        )}

        {/* Cart Items */}
        <div className="p-2 border">
          {!loading && cart?.shop.map((shop) => (
            <div key={shop._id} className="shop-box border p-4 mb-4 rounded">
              <h3 className="font-bold text-lg">
                {shop.admin?.companyName}
              </h3>

              {shop.items.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between border-b py-3"
                >
                  <div className="flex gap-3">
                    <img
                      src={item.productId?.image?.[0]}
                      alt=""
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <p className="font-semibold">{item.productId?.name}</p>
                      <small>{item.name}</small>
                      <p>Qty: {item.quantity}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-bold">
                      ₹{item.price * item.quantity}
                    </p>
                    <button
                      onClick={() => removeItem(item._id, shop._id)}
                      className="text-red-500 text-sm"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              <p className="text-right font-bold mt-2">
                Shop Total: ₹{shop.subtotal}
              </p>
            </div>
          ))}
          { cart ? 
          <div className="flex items-center justify-between px-4">
            <p className="text-left font-bold underline"> Total : {cart?.total}</p>
            <Link to='/checkout'
              className="p-2 rounded-xl font-semibold transition bg-green-600 hover:bg-green-700 text-white"
            >Checkout</Link>
            </div>
            : <></>
}
        </div>
      </div>


      <Footer />
    </>
  );
}

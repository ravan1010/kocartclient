import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import { LocateFixed } from "lucide-react";
import api from "../api";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

export default function Checkout() {

  const navigate = useNavigate();


  const [cartItems, setCartItems] = useState();
  const [platform, setPlatform] = useState(0);
  const [delivery, setDelivery] = useState(0);
  const [total, setTotal] = useState(0);

  const [selectaddress, setSelectaddress] = useState([]);
  const [saveAddress, setSaveAddress] = useState(null);
  const [mobileNo, setMobileNo] = useState("");

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [city, setCity] = useState("");
  const [distance, setdistance] = useState('');
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState("");

  const [paymentType, setPaymentType] = useState("ONLINE"); // or "COD"


  const isDisabled = delivery === 0 || !mobileNo || !saveAddress;

  /* ===================== 💰 PRICE CALCULATION ===================== */

  const subtotal = cartItems?.total

  useEffect(() => {
    const prototal = subtotal + platform + delivery
    const totalper = prototal / 0.97
    setTotal(totalper.toFixed(2));
  }, [subtotal, platform, delivery]);

  /* ===================== 📍 LIVE LOCATION ===================== */

  const handleLiveLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lon = pos.coords.longitude.toFixed(6);
        console.log(lat, lon)

        try {
          const geo = await axios.get(
            "https://api.geoapify.com/v1/geocode/reverse",
            {
              params: {
                lat,
                lon,
                format: "json",
                apiKey: '9101d57bd3a34d2194bb8222a55a6a3f'
              },
            }
          );

          setCity(geo.data.results[0]?.address_line2 || "");

          const res = await api.post(
            "/api/delivery-fee",
            { latitude: lat, longitude: lon },
            { withCredentials: true }
          );

          setDelivery(res.data.deliveryFee);
          setLatitude(lat);
          setLongitude(lon);
          setdistance(res.data.totalDistance)

        } catch (err) {
          setError("Failed to fetch location", err);
        } finally {
          setLocationLoading(false);
        }
      },
      (err) => {
        setError(err.message);
        setLocationLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  /* ===================== 🛒 CART ===================== */

  useEffect(() => {
    api
      .get("/api/cart/get", { withCredentials: true })
      .then((res) => {
        setCartItems(res.data);
        setPlatform(11);
      })
      .catch(console.error);
  }, []);

  /* ===================== 🏠 ADDRESS ===================== */

  useEffect(() => {
    api
      .get("/api/address-list", { withCredentials: true })
      .then((res) => setSelectaddress(res.data.address || []))
      .catch(console.error);
  }, []);

  const options = selectaddress.map((addr) => ({
    value: addr._id,
    label: (
      <div>
        <strong>{addr.Fullname}</strong>
        <div>
          {addr.cityTown}, {addr.state} - {addr.pincode}
        </div>
      </div>
    ),
    fullData: addr,
  }));

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {

    const res = await loadRazorpay();
    if (!res) {
      alert("Razorpay SDK failed");
      return;
    }
    const { data } = await api.post("/api/order/checkout", {
       total,
    });

    const options = {

      key: 'rzp_test_SCVWHulsyItuK9',
      amount: data.totalAmount,
      currency: "INR",
      order_id: data.razorOrderId,
      handler: (response) => {
        api.post("/api/order/verify", {
          response,
          items: cartItems,
          addressId: saveAddress,
          delivery,
          Number: mobileNo,
          totalAmount: total
        }).then((res) => {
          if (res.data.success) {
            navigate("/payment-success");
          } else {
            alert("Payment verification failed");
          }
        })
      },
    }

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-5xl mx-auto px-4">

        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Checkout
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* 📍 Location Section */}
          <section className="bg-white rounded-2xl shadow-md p-4 space-y-4">

            <button
              onClick={handleLiveLocation}
              disabled={locationLoading}
              className="flex items-center gap-2 border px-4 py-2 rounded-xl font-medium hover:bg-gray-50 transition"
            >
              <LocateFixed />
              {locationLoading ? "Getting location..." : "Use Live Location"}
            </button>

            <div className="rounded-xl overflow-hidden border">
              {latitude && longitude ? (
                <>
                  <MapContainer
                    center={[latitude, longitude]}
                    zoom={13}
                    scrollWheelZoom={false}
                    className="h-[250px] w-full"
                  >
                    <TileLayer
                      attribution='<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[latitude, longitude]}>
                      <Popup>You are here 📍</Popup>
                    </Marker>
                  </MapContainer>

                  <p className="text-sm text-gray-600 px-2 py-1">
                    {locationLoading ? "Detecting location..." : `${city} 📍`}
                  </p>
                </>
              ) :
                <></>
              }
            </div>

          </section>

          {/* 📞 Address & Contact */}
          <section className="bg-white rounded-2xl shadow-md p-4 space-y-4">

            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-1">
                Contact Number
              </label>
              <input
                type="tel"
                placeholder="Enter mobile number"
                maxLength={10}
                value={mobileNo}
                onChange={(e) => /^\d*$/.test(e.target.value) && setMobileNo(e.target.value)}

                required
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg text-gray-700">
                Select Address
              </h3>
              <Link
                to="/address"
                className="text-sm bg-blue-600 text-white px-4 py-1.5 rounded-full hover:bg-blue-700 transition"
              >
                + Add
              </Link>
            </div>

            <Select
              options={options}
              onChange={(e) => setSaveAddress(e.fullData)}
              className="w-full"
            />
          </section>

          {/* payment type */}

          <div className="bg-white p-4 rounded-xl shadow space-y-3">
            <h3 className="text-lg font-semibold">Payment Method</h3>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="paymentType"
                value="ONLINE"
                checked={paymentType === "ONLINE"}
                onChange={() => setPaymentType("ONLINE")}
              />
              <span>Online Payment</span>

            </label>
          </div>


          {/* 💰 Amount Summary */}

          <section className="bg-white rounded-2xl shadow-md p-4 space-y-3 md:col-span-2">

            <h3 className="text-xl font-bold text-gray-800">
              Order Summary
            </h3>
            <div className="border-b border-t ">
              {cartItems?.shop.map((shop) => (
                <div key={shop._id} className="shop-box mb-2 mt-2 rounded">
                  {shop.items.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center justify-between "
                    >
                      <div>
                        <img
                          src={item.productId?.image?.[0]}
                          alt=""
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                          <p className="font-semibold">{item.productId?.name}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-bold">
                          ₹{item.price * item.quantity}
                        </p>

                      </div>
                    </div>
                  ))}
                </div>
               ))} 
             </div> 
            {delivery > 0 && (<>
              <div className="flex justify-between text-sm">
                <span>Distance</span>
                <span>{distance}km</span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Delivery Fee</span>
                <span>₹{delivery}</span>
              </div>
            </>
            )}

            <div className="flex justify-between text-sm">
              <span>Platform Fee</span>
              <span>₹{platform}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>online pay</span>
              <span>3%</span>
            </div>

            <hr />

            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </section>

        </div>

        {/* ✅ Pay Button */}
        <button
          disabled={isDisabled}
          onClick={handlePayment}
          className={`w-full mt-6 py-3 rounded-xl text-lg font-semibold transition
        ${isDisabled
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700"
            }`}
        >
          {isDisabled ? "Complete required steps" : (paymentType === "COD" ? "Place Order" : "Pay Online")
          }
        </button>

      </div>
    </div>

  );
}

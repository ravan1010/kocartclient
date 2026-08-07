
import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { Navigation } from "lucide-react";
import FullScreenLocationPicker from "../hooks/FullScreenLocationPicker";


export default function GoodsAuto() {
        const navigate = useNavigate();

         // Which map is open?
          const [locationPicker, setLocationPicker] = useState(null);

  const [form, setForm] = useState({
  pickup: {
    address: "",
    name: "",
    phone: "",
    latitude: "",
    longitude: "",
  },

  drop: {
    address: "",
    name: "",
    phone: "",
    latitude: "",
    longitude: "",
  },

  goods: {
    itemType: "",
    estimatedWeight: "",
    helpersRequired: 0,
    loadingRequired: false,
    unloadingRequired: false,
    instructions: "",
  },

  payment: {
    method: "cash",
  },
});

  const [step, setStep] = useState(1);
  const [distance, setDistance] = useState(null);
  const [amount, setAmount] = useState(null);

  const [oneclick, setOneclick] = useState(1);
  
    const isDisabled =
    oneclick !== 1;

  
  // =====================================================
  // OPEN MAP
  // =====================================================

  const openPickupMap = () => {
    setLocationPicker("pickup");
  };

  const openDropMap = () => {
    setLocationPicker("drop");
  };

  // -----------------------------
  // Pickup location
  // -----------------------------

  const handlePickupConfirm = (location) => {
    setForm((prev) => ({
      ...prev,
      pickup: {
        address: location.address,
        latitude: location.latitude,
        longitude: location.longitude,
      },
    }));
  };

 // -----------------------------
  // Drop location
  // -----------------------------

  const handleDropConfirm = (location) => {
    setForm((prev) => ({
      ...prev,
      drop: {
        address: location.address,
        latitude: location.latitude,
        longitude: location.longitude,
      },
    }));
  };

  // =====================================================
  // FULL SCREEN MAP
  // =====================================================
  
    if (locationPicker) {
      return (
        <FullScreenLocationPicker
          type={locationPicker}
  
          onCancel={() => {
            setLocationPicker(null);
          }}
  
          onConfirm={(location) => {
            if (locationPicker === "pickup") {
              handlePickupConfirm(location);
            } else {
              handleDropConfirm(location);
            }
          }}
        />
      );
    }

  // -----------------------------
  // Check distance
  // -----------------------------

  const checkDistance = async () => {
    try {
      if (
        !form.pickup.latitude ||
        !form.pickup.longitude ||
        !form.drop.latitude ||
        !form.drop.longitude
      ) {
        alert("Please select pickup and drop locations");
        return;
      }

      const res = await api.post("/api/parcel/distance", {
        pickuplat: Number(form.pickup.latitude),
        pickuplng: Number(form.pickup.longitude),

        droplat: Number(form.drop.latitude),
        droplng: Number(form.drop.longitude),
      });

      setDistance(res.data.distance);
      setAmount(res.data.amount);

      setStep(2);
    } catch (err) {
      console.log(err);

      alert(
        err.response?.data?.message ||
        "Unable to calculate distance"
      );
    }
  };

  // -----------------------------
  // Submit order
  // -----------------------------

  const handleSubmit = async () => {

    if(oneclick === 2){
      return
    }

    setOneclick(2)

    try {
      await api.post("/api/goods-auto/order", {
        pickup: {
          address: form.pickup.address,
          location: {
            type: "Point",
            coordinates: [
              Number(form.pickup.longitude),
              Number(form.pickup.latitude),
            ],
          },
        },

        drop: {
          address: form.drop.address,
          location: {
            type: "Point",
            coordinates: [
              Number(form.drop.longitude),
              Number(form.drop.latitude),
            ],
          },
        },

        passenger: form.goods,
        payment: form.payment,
        distance,
        amount,
      })
      .then((res) => {
        if(res.data.success){
          setOneclick(1)
            navigate(`/goodsAuto/orders`)
        }
      }
    )
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-5">

      {/* =========================
          STEP 1
      ========================== */}

      {step === 1 && (
        <>
          <h1 className="text-3xl font-bold mb-6">
            🚖 Passenger Auto Booking
          </h1>

          {/* Pickup */}

          <div className="bg-white rounded-xl shadow p-5 mb-5">
            <h2 className="font-bold text-xl mb-4">
              Pickup
            </h2>

             <input
              className="w-full border rounded-lg p-3 mb-3"
              placeholder="Pickup Address"
              value={form.pickup.address}
              onChange={(e) =>
                setForm({
                  ...form,
                  pickup: {
                    ...form.pickup,
                    address: e.target.value,
                  },
                })
              }
            />

            <div className="grid grid-cols-2 gap-3 mb-3">
              <input
                className="border rounded-lg p-3"
                placeholder="Sender Name"
                value={form.pickup.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    pickup: {
                      ...form.pickup,
                      name: e.target.value,
                    },
                  })
                }
              />

              <input
                className="border rounded-lg p-3"
                placeholder="Sender Phone"
                value={form.pickup.phone}
                minLength={10}
                maxLength={10}
                onChange={(e) =>
                  setForm({
                    ...form,
                    pickup: {
                      ...form.pickup,
                      phone: e.target.value,
                    },
                  })
                }
              />
            </div>

 <div className="bg-white rounded-xl shadow p-5 mb-5">



            {/* Selected pickup */}


            {form.pickup.latitude && (
              <div className="mt-4 p-4 bg-green-50 rounded-xl">

                <div className="flex items-start justify-between gap-3">

                  <div className="min-w-0">

                    <p className="font-semibold text-green-700">
                      Pickup Selected
                    </p>

                    <p className="text-sm text-gray-700 mt-1">
                      {form.pickup.address}
                    </p>

                    {/* <p className="text-xs text-gray-500 mt-1">
        {form.pickup.latitude},{" "}
        {form.pickup.longitude}
      </p> */}

                  </div>

                  <a
                    href={`https://www.google.com/maps?q=${form.pickup.latitude},${form.pickup.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
        shrink-0
        inline-flex
        items-center
        gap-2
        px-3
        py-2
        rounded-xl
        bg-blue-600
        text-white
        text-sm
        font-semibold
        shadow-sm
        hover:bg-blue-700
        active:scale-95
        transition-all
      "
                  >
                    <Navigation size={16} />
                    Navigate
                  </a>

                </div>

              </div>
            )}

          </div>
          </div>

          {/* Drop */}

          <div className="bg-white rounded-xl shadow p-5 mb-5">
            <h2 className="font-bold text-xl mb-4">
              Drop
            </h2>

            <input
              className="w-full border rounded-lg p-3 mb-3"
              placeholder="Drop Address"
              value={form.drop.address}
              onChange={(e) =>
                setForm({
                  ...form,
                  drop: {
                    ...form.drop,
                    address: e.target.value,
                  },
                })
              }
            />

            <div className="grid grid-cols-2 gap-3 mb-3">
              <input
                className="border rounded-lg p-3"
                placeholder="Receiver Name"
                value={form.drop.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    drop: {
                      ...form.drop,
                      name: e.target.value,
                    },
                  })
                }
              />

              <input
                className="border rounded-lg p-3"
                placeholder="Receiver Phone"
                value={form.drop.phone}
                minLength={10}
                maxLength={10}
                onChange={(e) =>
                  setForm({
                    ...form,
                    drop: {
                      ...form.drop,
                      phone: e.target.value,
                    },
                  })
                }
              />
            </div>

        <div className="bg-white rounded-xl shadow p-5 mb-5">

            

            <button
              type="button"
              onClick={() => handleGPS("drop")}
              disabled={locationLoading}
              className="
    inline-flex
    items-center
    gap-2
    px-4
    py-2
    rounded-full
    bg-blue-50
    text-blue-600
    border
    border-blue-100
    font-semibold
    text-sm
    hover:bg-blue-600
    hover:text-white
    disabled:opacity-50
    transition-all
    mb-4
  "
            >
              <Navigation size={16} />

              {locationLoading
                ? "Getting Location..."
                : "Use Current Location"}
            </button>

            <LocationPicker
              type="drop"
              initialLocation={
                form.drop.latitude &&
                  form.drop.longitude
                  ? {
                    latitude: Number(
                      form.drop.latitude
                    ),
                    longitude: Number(
                      form.drop.longitude
                    ),
                  }
                  : undefined
              }
              onConfirm={handleDropConfirm}
            />



            {/* Selected drop */}

            {form.drop.latitude && (
              <div className="mt-4 p-4 bg-green-50 rounded-xl">

                <div className="flex items-start justify-between gap-3">

                  <div className="min-w-0">

                    <p className="font-semibold text-green-700">
                      Pickup Selected
                    </p>

                    <p className="text-sm text-gray-700 mt-1">
                      {form.drop.address}
                    </p>

                    {/* <p className="text-xs text-gray-500 mt-1">
        {form.drop.latitude},{" "}
        {form.drop.longitude}
      </p> */}

                  </div>

                  <a
                    href={`https://www.google.com/maps?q=${form.drop.latitude},${form.drop.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
        shrink-0
        inline-flex
        items-center
        gap-2
        px-3
        py-2
        rounded-xl
        bg-blue-600
        text-white
        text-sm
        font-semibold
        shadow-sm
        hover:bg-blue-700
        active:scale-95
        transition-all
        mb-4
      "
                  >
                    <Navigation size={16} />
                    Navigate
                  </a>

                </div>

              </div>
            )}

          </div>
          </div>

        {/* goods */}
          <div className="bg-white rounded-xl shadow p-5 mb-5">
  <h2 className="text-xl font-bold mb-4">
    🚚 Goods Details
  </h2>

  {/* Item Type */}
  <div className="mb-4">
    <label className="block mb-2 font-medium">
      Item Type
    </label>

    <select
      className="w-full border rounded-lg p-3"
      value={form.goods.itemType}
      onChange={(e) =>
        setForm({
          ...form,
          goods: {
            ...form.goods,
            itemType: e.target.value,
          },
        })
      }
    >
      <option value="">Select Item</option>
      <option value="Furniture">Furniture</option>
      <option value="Electronics">Electronics</option>
      <option value="Groceries">Groceries</option>
      <option value="Construction Material">
        Construction Material
      </option>
      <option value="House Shifting">
        House Shifting
      </option>
      <option value="Others">Others</option>
    </select>
  </div>

  {/* Weight */}
  <div className="mb-4">
    <label className="block mb-2 font-medium">
      Estimated Weight (kg)
    </label>

    <input
      type="number"
      className="w-full border rounded-lg p-3"
      placeholder="Example: 120"
      value={form.goods.estimatedWeight}
      onChange={(e) =>
        setForm({
          ...form,
          goods: {
            ...form.goods,
            estimatedWeight: e.target.value,
          },
        })
      }
    />
  </div>

  {/* Helpers */}
  <div className="mb-4">
    <label className="block mb-2 font-medium">
      Helpers Required
    </label>

    <select
      className="w-full border rounded-lg p-3"
      value={form.goods.helpersRequired}
      onChange={(e) =>
        setForm({
          ...form,
          goods: {
            ...form.goods,
            helpersRequired: Number(e.target.value),
          },
        })
      }
    >
      <option value={0}>No Helper</option>
      <option value={1}>1 Helper</option>
      <option value={2}>2 Helpers</option>
      <option value={3}>3 Helpers</option>
    </select>
  </div>

  {/* Loading */}
  <label className="flex items-center gap-3 mb-3">
    <input
      type="checkbox"
      checked={form.goods.loadingRequired}
      onChange={(e) =>
        setForm({
          ...form,
          goods: {
            ...form.goods,
            loadingRequired: e.target.checked,
          },
        })
      }
    />

    Loading Required
  </label>

  {/* Unloading */}
  <label className="flex items-center gap-3 mb-4">
    <input
      type="checkbox"
      checked={form.goods.unloadingRequired}
      onChange={(e) =>
        setForm({
          ...form,
          goods: {
            ...form.goods,
            unloadingRequired: e.target.checked,
          },
        })
      }
    />

    Unloading Required
  </label>

  {/* Instructions */}
  <div>
    <label className="block mb-2 font-medium">
      Instructions
    </label>

    <textarea
      rows={4}
      className="w-full border rounded-lg p-3"
      placeholder="Any special instructions..."
      value={form.goods.instructions}
      onChange={(e) =>
        setForm({
          ...form,
          goods: {
            ...form.goods,
            instructions: e.target.value,
          },
        })
      }
    />
  </div>
</div>

          {/* Payment */}

          <div className="bg-white rounded-xl shadow p-5 mb-5">
            <label>
              <input
                type="radio"
                value="cash"
                checked={form.payment.method === "cash"}
                onChange={(e) =>
                  setForm({
                    ...form,
                    payment: {
                      method: e.target.value,
                    },
                  })
                }
              />
              <span className="ml-2">Cash</span>
            </label>
          </div>

          <button
            onClick={checkDistance}
            className="w-full bg-green-600 text-white rounded-xl p-4"
          >
            Continue
          </button>
        </>
      )}

      {step === 2 && (
        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-2xl font-bold mb-4">
            Ride Summary
          </h2>

          <p>Distance : {distance?.toFixed(2)} km</p>
          <p> amount : auto driver will call you, he tell amount </p>
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setStep(1)}
              className="w-1/2 bg-gray-300 p-3 rounded-lg"
            >
              Back
            </button>

            <button
            disabled={isDisabled}
              onClick={handleSubmit}
              className="w-1/2 bg-green-600 text-white p-3 rounded-lg"
            >
              Confirm Ride
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 
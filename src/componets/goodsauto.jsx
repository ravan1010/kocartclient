
import { useEffect, useState } from "react";
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

  // ---------------------------------
  //      active orders check
  // ---------------------------------

  useEffect(() => {
    const checkActiveOrder = async () => {
      try {
        const res = await api.get("/api/auto/active");

        if (res.data.order) {
          navigate(
            `/goodsAuto/order/${res.data.order._id}`,
            { replace: true }
          );
        }
      } catch (error) {
        console.error(error);
      }
    };

    checkActiveOrder();
  }, []);

  // =====================================================
  // OPEN MAP
  // =====================================================

  const openPickupMap = () => {
    setLocationPicker("pickup");
  };

  const openDropMap = () => {
    setLocationPicker("drop");
  };

  // =====================================================
  // PICKUP CONFIRM
  // =====================================================

  const handlePickupConfirm = (location) => {
    setForm((prev) => ({
      ...prev,

      pickup: {
        address: location.address,
        latitude: location.latitude,
        longitude: location.longitude,
      },
    }));

    setLocationPicker(null);
  };

  // =====================================================
  // DROP CONFIRM
  // =====================================================

  const handleDropConfirm = (location) => {
    setForm((prev) => ({
      ...prev,

      drop: {
        address: location.address,
        latitude: location.latitude,
        longitude: location.longitude,
      },
    }));

    setLocationPicker(null);
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
        !form.drop.longitude ||
        !form.pickup.name ||
        !form.pickup.phone ||
        !form.drop.name ||
        !form.drop.phone ||
      
      ) {
        alert("Please select pickup and drop locations and details");
        return;
      }

      if(  !form.goods.itemType ||
        !form.goods.estimatedWeight
      ){
        alert("please enter goods item and weight")
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

    if (oneclick === 2) {
      return
    }

    if(!form.pickup.latitude || !form.pickup.longitude ||
      !form.
    )

    setOneclick(2)

    try {
      await api.post("/api/goods-auto/order", {
        pickup: {
          name: form.pickup.name,
          phone: form.pickup.phone,
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
          name: form.drop.name,
          phone: form.drop.phone,
          address: form.drop.address,
          location: {
            type: "Point",
            coordinates: [
              Number(form.drop.longitude),
              Number(form.drop.latitude),
            ],
          },
        },

        goods: form.goods,
        payment: form.payment,
        distance,
        amount,
      })
        .then((res) => {
          if (res.data.success) {
            setOneclick(1)
            navigate(`/goodsAuto/order/${res.data.order._id}`)
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
            goods Auto Booking
          </h1>

          {/* Pickup */}

          <div className="bg-white rounded-xl shadow p-5 mb-5">
            <h2 className="font-bold text-xl mb-4">
              Pickup
            </h2>

            <button
              type="button"
              onClick={openPickupMap}
              className="
                w-full
                border-2
                border-dashed
                border-gray-300
                rounded-2xl
                p-5
                text-left
                hover:border-indigo-500
                hover:bg-indigo-50
                transition
              "
            >
              <div className="text-3xl mb-2">
                📍
              </div>

              <p className="font-bold text-gray-800">
                {form.pickup.latitude
                  ? "Change Pickup Location"
                  : "Select Pickup Location"}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Open full-screen map and choose pickup point
              </p>
            </button>



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
                      hover:bg-blue-700
                    "
                  >
                    <Navigation size={16} />
                    Navigate
                  </a>

                </div>

                <button
                  type="button"
                  onClick={openPickupMap}
                  className="
                    mt-3
                    text-sm
                    font-semibold
                    text-indigo-600
                  "
                >
                  Change Pickup
                </button>

              </div>
            )}

          </div>

          {/* Drop */}

          <div className="bg-white rounded-xl shadow p-5 mb-5">
            <h2 className="font-bold text-xl mb-4">
              Drop
            </h2>

            <button
              type="button"
              onClick={openDropMap}
              className="
                w-full
                border-2
                border-dashed
                border-gray-300
                rounded-2xl
                p-5
                text-left
                hover:border-indigo-500
                hover:bg-indigo-50
                transition
              "
            >
              <div className="text-3xl mb-2">
                📍
              </div>

              <p className="font-bold text-gray-800">
                {form.drop.latitude
                  ? "Change Drop Location"
                  : "Select Drop Location"}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Open full-screen map and choose drop point
              </p>
            </button>

            {/* SELECTED DROP */}

            {form.drop.latitude && (
              <div className="mt-4 p-4 bg-green-50 rounded-xl">

                <div className="flex items-start justify-between gap-3">

                  <div className="min-w-0">

                    <p className="font-semibold text-green-700">
                      Drop Selected
                    </p>

                    <p className="text-sm text-gray-700 mt-1">
                      {form.drop.address}
                    </p>

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
                      hover:bg-blue-700
                    "
                  >
                    <Navigation size={16} />
                    Navigate
                  </a>

                </div>

                <button
                  type="button"
                  onClick={openDropMap}
                  className="
                    mt-3
                    text-sm
                    font-semibold
                    text-indigo-600
                  "
                >
                  Change Drop
                </button>

              </div>
            )}

          </div>

          {/* goods */}
          <div className="bg-white rounded-xl shadow p-5 mb-5">
            <h2 className="text-xl font-bold mb-4">
              🚚 Goods Details
            </h2>

            {/* Sender  */}
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
                type="tel"
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

            {/* Receiver  */}
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
                type="tel"
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
        <div className="bg-white rounded-2xl shadow p-6">

          <h2 className="text-2xl font-bold mb-5">
            Summary
          </h2>

          {/* Goods Details */}
          <div className="bg-gray-50 rounded-2xl p-4 space-y-4">

            <h3 className="font-bold text-lg">
              📦 Goods Details
            </h3>

            <div className="flex justify-between">
              <span className="text-gray-500">
                Item Type
              </span>
              <span className="font-semibold text-gray-900">
                {form.goods.itemType || "-"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">
                Estimated Weight
              </span>
              <span className="font-semibold">
                {form.goods.estimatedWeight
                  ? `${form.goods.estimatedWeight} kg`
                  : "-"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">
                Helpers Required
              </span>
              <span className="font-semibold">
                {form.goods.helpersRequired ?? 0}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">
                Loading
              </span>
              <span
                className={
                  form.goods.loadingRequired
                    ? "font-semibold text-green-600"
                    : "font-semibold text-gray-500"
                }
              >
                {form.goods.loadingRequired
                  ? "Required"
                  : "Not Required"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">
                Unloading
              </span>
              <span
                className={
                  form.goods.unloadingRequired
                    ? "font-semibold text-green-600"
                    : "font-semibold text-gray-500"
                }
              >
                {form.goods.unloadingRequired
                  ? "Required"
                  : "Not Required"}
              </span>
            </div>

            {/* Instructions */}
            {form.goods.instructions && (
              <div className="pt-3 border-t border-gray-200">
                <p className="text-gray-500 text-sm mb-1">
                  Instructions
                </p>

                <p className="font-medium text-gray-800">
                  {form.goods.instructions}
                </p>
              </div>
            )}
          </div>

          {/* Trip Details */}
          <div className="mt-4 bg-gray-50 rounded-2xl p-4 space-y-4">

            <h3 className="font-bold text-lg">
              🚚 Trip Details
            </h3>

            <div className="flex justify-between">
              <span className="text-gray-500">
                Distance
              </span>

              <span className="font-semibold">
                {distance?.toFixed(2)} km
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">
                Payment
              </span>

              <span className="font-semibold capitalize">
                {form.payment.method}
              </span>
            </div>

            <div className="pt-3 border-t border-gray-200">
              {/* <p className="text-gray-500 text-sm">
                Estimated Amount
              </p>

              <p className="text-xl font-bold text-green-600">
                Auto driver will call you and confirm the amount
              </p> */}
            </div>

          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-6">

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-1/2 bg-gray-200 hover:bg-gray-300 p-3 rounded-xl font-semibold"
            >
              Back
            </button>

            <button
              type="button"
              disabled={isDisabled}
              onClick={handleSubmit}
              className="w-1/2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white p-3 rounded-xl font-semibold"
            >
              Confirm Order
            </button>

          </div>

        </div>
      )}
    </div>
  );
} 
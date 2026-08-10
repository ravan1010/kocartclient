
import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { Navigation } from "lucide-react";
import FullScreenLocationPicker from "../hooks/FullScreenLocationPicker";

export default function PassengerAuto() {
  const navigate = useNavigate();

  // Which map is open?
  const [locationPicker, setLocationPicker] = useState(null);

  const [form, setForm] = useState({
    pickup: {
      address: "",
      latitude: "",
      longitude: "",
    },

    drop: {
      address: "",
      latitude: "",
      longitude: "",
    },

    passenger: {
      name: "",
      phone: "",
      passengers: 1,
    },

    payment: {
      method: "cash",
    },
  });

  const [step, setStep] = useState(1);
  const [distance, setDistance] = useState(null);
  const [amount, setAmount] = useState(null);
  const [oneclick, setOneclick] = useState(1);

  const isDisabled = oneclick !== 1;

  // ---------------------------------
  //      active orders check
  // ---------------------------------

  useEffect(() => {
  const checkActiveOrder = async () => {
    try {
      const res = await api.get("/api/auto/active");

      if (res.data.order) {
        navigate(
          `/PassengerAuto/order/${res.data.order._id}`,
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

  // =====================================================
  // CHECK DISTANCE
  // =====================================================

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

  // =====================================================
  // SUBMIT ORDER
  // =====================================================

  const handleSubmit = async () => {
    if (oneclick === 2) return;

    setOneclick(2);

    try {
      const res = await api.post(
        "/api/passenger-auto/order",
        {
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

          passenger: form.passenger,

          payment: form.payment,

          distance,

          amount,
        }
      );

      if (res.data.success) {
        setOneclick(1);

        navigate(`/PassengerAuto/order/${res.data.order._id}`);
      }
    } catch (err) {
      console.log(err);

      setOneclick(1);

      alert(
        err.response?.data?.message ||
        "Failed to create ride"
      );
    }
  };

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="max-w-4xl mx-auto p-5">

      {/* =================================================
          STEP 1
      ================================================= */}

      {step === 1 && (
        <>
          <h1 className="text-3xl font-bold mb-6">
            🚖 Passenger Auto Booking
          </h1>

          {/* =================================================
              PICKUP
          ================================================= */}

          <div className="bg-white rounded-xl shadow p-5 mb-5">

            <h2 className="font-bold text-xl mb-4">
              📍 Pickup
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


            {/* SELECTED PICKUP */}

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

          {/* =================================================
              DROP
          ================================================= */}

          <div className="bg-white rounded-xl shadow p-5 mb-5">

            <h2 className="font-bold text-xl mb-4">
              📍 Drop
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

          {/* =================================================
              PASSENGER
          ================================================= */}

          <div className="bg-white rounded-xl shadow p-5 mb-5">

            <h2 className="font-bold text-xl mb-4">
              Passenger Details
            </h2>

            <input
              className="w-full border rounded-lg p-3 mb-3"
              placeholder="Passenger Name"
              value={form.passenger.name}
              maxLength={20}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,

                  passenger: {
                    ...prev.passenger,
                    name: e.target.value,
                  },
                }))
              }
            />

            <input
              type="tel"
              className="w-full border rounded-lg p-3 mb-3"
              placeholder="Mobile Number"
              value={form.passenger.phone}
              minLength={10}
              maxLength={10}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,

                  passenger: {
                    ...prev.passenger,
                    phone: e.target.value,
                  },
                }))
              }
            />

            <select
              className="w-full border rounded-lg p-3"
              value={form.passenger.passengers}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,

                  passenger: {
                    ...prev.passenger,
                    passengers: Number(e.target.value),
                  },
                }))
              }
            >
              <option value={1}>
                1 Passenger
              </option>

              <option value={2}>
                2 Passengers
              </option>

              <option value={3}>
                3 Passengers
              </option>
            </select>

          </div>

          {/* =================================================
              PAYMENT
          ================================================= */}

          <div className="bg-white rounded-xl shadow p-5 mb-5">

            <label className="flex items-center">

              <input
                type="radio"
                value="cash"
                checked={
                  form.payment.method === "cash"
                }
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,

                    payment: {
                      method: e.target.value,
                    },
                  }))
                }
              />

              <span className="ml-2">
                Cash
              </span>

            </label>

          </div>

          {/* =================================================
              CONTINUE
          ================================================= */}

          <button
            onClick={checkDistance}
            disabled={
              !form.pickup.latitude ||
              !form.drop.latitude
            }
            className="
              w-full
              bg-green-600
              disabled:bg-gray-400
              text-white
              rounded-xl
              p-4
              font-semibold
            "
          >
            Continue
          </button>
        </>
      )}

      {/* =================================================
          STEP 2
      ================================================= */}

      {step === 2 && (
        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-2xl font-bold mb-4">
            Ride Summary
          </h2>

          <div className="space-y-4">

            <div>
              <p className="text-sm text-gray-500">
                Pickup
              </p>

              <p className="font-medium">
                {form.pickup.address}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Drop
              </p>

              <p className="font-medium">
                {form.drop.address}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Distance
              </p>

              <p className="font-semibold">
                {distance?.toFixed(2)} km
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Fare
              </p>

              <p className="font-semibold">
                Auto driver will call you
                and tell the amount
              </p>
            </div>

          </div>

          <div className="flex gap-4 mt-6">

            <button
              onClick={() => setStep(1)}
              className="
                w-1/2
                bg-gray-300
                p-3
                rounded-lg
              "
            >
              Back
            </button>

            <button
              disabled={isDisabled}
              onClick={handleSubmit}
              className="
                w-1/2
                bg-green-600
                disabled:bg-gray-400
                text-white
                p-3
                rounded-lg
              "
            >
              {oneclick === 2
                ? "Booking..."
                : "Confirm Ride"}
            </button>

          </div>

        </div>
      )}

    </div>
  );
}


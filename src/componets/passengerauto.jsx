import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import LocationPicker from "../hooks/LocationPicker";
import { Navigation } from "lucide-react";
import useCurrentLocation from "../hooks/useCurrentLocation";


export default function PassengerAuto() {
  const navigate = useNavigate();

  const {
    getCurrentLocation,
    loading: locationLoading,
  } = useCurrentLocation();

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

  // -----------------------------
  //   use current location
  // -----------------------------

  const handleGPS = async (type) => {
    try {
      const location = await getCurrentLocation();

          console.log("GPS LOCATION:", location);


      if (type === "pickup") {
        handlePickupConfirm(location);
      } else {
        handleDropConfirm(location);
      }
    } catch (error) {
      console.log(error);

      alert(
        "Unable to get your current location. Please allow location permission."
      );
    }
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
    if (oneclick === 2) {
      return;
    }

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

        navigate("/PassengerAuto/orders");
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

          {/* =====================
              PICKUP
          ====================== */}

          <div className="bg-white rounded-xl shadow p-5 mb-5">

            <h2 className="font-bold text-xl mb-4">
              📍 Pickup
            </h2>

            <button
              type="button"
              onClick={() => handleGPS("pickup")}
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
  "
            >
              <Navigation size={16} />

              {locationLoading
                ? "Getting Location..."
                : "Use Current Location"}
            </button>

            <LocationPicker
              type="pickup"
              initialLocation={
                form.pickup.latitude &&
                  form.pickup.longitude
                  ? {
                    latitude: Number(
                      form.pickup.latitude
                    ),
                    longitude: Number(
                      form.pickup.longitude
                    ),
                  }
                  : undefined
              }
              onConfirm={handlePickupConfirm}
            />


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

          {/* =====================
              DROP
          ====================== */}

          <div className="bg-white rounded-xl shadow p-5 mb-5">

            <h2 className="font-bold text-xl mb-4">
              📍 Drop
            </h2>

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

          {/* =====================
              PASSENGER
          ====================== */}

          <div className="bg-white rounded-xl shadow p-5 mb-5">

            <h2 className="font-bold text-xl mb-4">
              Passenger Details
            </h2>

            <input
              className="w-full border rounded-lg p-3 mb-3"
              placeholder="Passenger Name"
              value={form.passenger.name}
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
              className="w-full border rounded-lg p-3 mb-3"
              placeholder="Mobile Number"
              value={form.passenger.phone}
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
                    passengers: Number(
                      e.target.value
                    ),
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

              <option value={4}>
                4 Passengers
              </option>

            </select>

          </div>

          {/* =====================
              PAYMENT
          ====================== */}

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

          {/* =====================
              CONTINUE
          ====================== */}

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

      {/* =========================
          STEP 2
      ========================== */}

      {step === 2 && (
        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-2xl font-bold mb-4">
            Ride Summary
          </h2>

          <div className="space-y-3">

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
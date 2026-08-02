import { useState } from "react";

export default function BikeParcelOrder() {
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
    parcel: {
      itemName: "",
      category: "",
      weight: "",
      quantity: 1,
      fragile: false,
      instructions: "",
    },
    payment: {
      method: "cash",
    },
  });

  const handleSubmit = () => {
    const payload = {
      customer: "USER_ID",
      serviceType: "bike_parcel",

      pickup: {
        address: form.pickup.address,
        name: form.pickup.name,
        phone: form.pickup.phone,
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
        name: form.drop.name,
        phone: form.drop.phone,
        location: {
          type: "Point",
          coordinates: [
            Number(form.drop.longitude),
            Number(form.drop.latitude),
          ],
        },
      },

      parcel: form.parcel,

      payment: form.payment,
    };

    console.log(payload);

    
  };

  return (
    <div className="max-w-4xl mx-auto p-5">

      <h1 className="text-3xl font-bold mb-6">
        🏍 Bike Parcel Delivery
      </h1>

      {/* Pickup */}

      <div className="bg-white rounded-xl shadow p-5 mb-5">
        <h2 className="text-xl font-bold mb-4">
          Pickup Details
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

        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            step="any"
            className="border rounded-lg p-3"
            placeholder="Latitude"
            value={form.pickup.latitude}
            onChange={(e) =>
              setForm({
                ...form,
                pickup: {
                  ...form.pickup,
                  latitude: e.target.value,
                },
              })
            }
          />

          <input
            type="number"
            step="any"
            className="border rounded-lg p-3"
            placeholder="Longitude"
            value={form.pickup.longitude}
            onChange={(e) =>
              setForm({
                ...form,
                pickup: {
                  ...form.pickup,
                  longitude: e.target.value,
                },
              })
            }
          />
        </div>
      </div>

      {/* Drop */}

      <div className="bg-white rounded-xl shadow p-5 mb-5">
        <h2 className="text-xl font-bold mb-4">
          Drop Details
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

        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            step="any"
            className="border rounded-lg p-3"
            placeholder="Latitude"
            value={form.drop.latitude}
            onChange={(e) =>
              setForm({
                ...form,
                drop: {
                  ...form.drop,
                  latitude: e.target.value,
                },
              })
            }
          />

          <input
            type="number"
            step="any"
            className="border rounded-lg p-3"
            placeholder="Longitude"
            value={form.drop.longitude}
            onChange={(e) =>
              setForm({
                ...form,
                drop: {
                  ...form.drop,
                  longitude: e.target.value,
                },
              })
            }
          />
        </div>
      </div>

      {/* Parcel */}

      <div className="bg-white rounded-xl shadow p-5 mb-5">
        <h2 className="text-xl font-bold mb-4">
          Parcel Details
        </h2>

        <input
          className="w-full border rounded-lg p-3 mb-3"
          placeholder="Item Name"
          value={form.parcel.itemName}
          onChange={(e) =>
            setForm({
              ...form,
              parcel: {
                ...form.parcel,
                itemName: e.target.value,
              },
            })
          }
        />

        <select
          className="w-full border rounded-lg p-3 mb-3"
          value={form.parcel.category}
          onChange={(e) =>
            setForm({
              ...form,
              parcel: {
                ...form.parcel,
                category: e.target.value,
              },
            })
          }
        >
          <option value="">Select Category</option>
          <option value="Documents">Documents</option>
          <option value="Food">Food</option>
          <option value="Electronics">Electronics</option>
          <option value="Medicines">Medicines</option>
          <option value="Clothes">Clothes</option>
        </select>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <input
            type="number"
            className="border rounded-lg p-3"
            placeholder="Weight (kg)"
            value={form.parcel.weight}
            onChange={(e) =>
              setForm({
                ...form,
                parcel: {
                  ...form.parcel,
                  weight: e.target.value,
                },
              })
            }
          />

          <input
            type="number"
            className="border rounded-lg p-3"
            placeholder="Quantity"
            value={form.parcel.quantity}
            onChange={(e) =>
              setForm({
                ...form,
                parcel: {
                  ...form.parcel,
                  quantity: e.target.value,
                },
              })
            }
          />
        </div>

        <label className="flex items-center gap-2 mb-3">
          <input
            type="checkbox"
            checked={form.parcel.fragile}
            onChange={(e) =>
              setForm({
                ...form,
                parcel: {
                  ...form.parcel,
                  fragile: e.target.checked,
                },
              })
            }
          />
          Fragile Parcel
        </label>

        <textarea
          className="w-full border rounded-lg p-3"
          rows={3}
          placeholder="Instructions"
          value={form.parcel.instructions}
          onChange={(e) =>
            setForm({
              ...form,
              parcel: {
                ...form.parcel,
                instructions: e.target.value,
              },
            })
          }
        />
      </div>

      {/* Payment */}

      <div className="bg-white rounded-xl shadow p-5 mb-5">
        <h2 className="text-xl font-bold mb-4">
          Payment Method
        </h2>

        <label className="mr-5">
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

        {/* <label>
          <input
            type="radio"
            value="online"
            checked={form.payment.method === "online"}
            onChange={(e) =>
              setForm({
                ...form,
                payment: {
                  method: e.target.value,
                },
              })
            }
          />
          <span className="ml-2">Online</span>
        </label> */}
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl p-4 font-bold"
      >
        Continue
      </button>
    </div>
  );
}
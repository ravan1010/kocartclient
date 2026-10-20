
import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";

const BusDriverSearch = () => {
  const [driverId, setDriverId] = useState("");
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();

    const id = driverId.trim();

    setDriver(null);
    setError("");

    if (!id) {
      setError("Please enter a driver ID");
      return;
    }

    try {
      setLoading(true);

      const response = await api.get(
        "/api/search",
        {
          params: { driverId: id },
        }
      );

      if (response.data?.success && response.data?.driver) {
        setDriver(response.data.driver);
      } else {
        setError("Driver ID not found");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to search driver"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="bg-white border rounded-2xl shadow-sm p-5">
        <h1 className="text-xl font-bold mb-4">
          Track Your Bus Parcel
        </h1>

        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={driverId}
            onChange={(e) => setDriverId(e.target.value)}
            placeholder="Enter driver ID"
            className="min-w-0 flex-1 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white px-5 rounded-xl font-semibold disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {error && (
          <p className="text-red-600 text-sm mt-3">
            {error}
          </p>
        )}

        {driver && (
          <div className="mt-5 border rounded-xl p-4">
            <p className="text-sm text-gray-500">
              Driver found
            </p>

            <Link
              to={`/track-driver/${encodeURIComponent(
                driver.driverId
              )}`}
              className="inline-block mt-2 text-indigo-600 font-bold underline break-all"
            >
              {driver.driverId}
            </Link>

            <p className="mt-2 text-gray-700">
              {driver.driverName || "Driver"}
            </p>

            <Link
              to={`/track-driver/${encodeURIComponent(
                driver.driverId
              )}`}
              className="inline-block mt-3 bg-indigo-600 text-white rounded-lg px-4 py-2"
            >
              Track Driver →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusDriverSearch;

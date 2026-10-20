
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import api from "../api";

// Fix default Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const busIcon = new L.DivIcon({
  className: "bus-driver-marker",
  html: `
    <div style="
      width:44px;
      height:44px;
      background:#4f46e5;
      border:3px solid white;
      border-radius:50%;
      box-shadow:0 2px 10px #0004;
      display:flex;
      justify-content:center;
      align-items:center;
      font-size:24px;
    ">🚌</div>
  `,
  iconSize: [44, 44],
  iconAnchor: [22, 22],
});

const RecenterMap = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom(), {
        animate: true,
      });
    }
  }, [position?.[0], position?.[1], map]);

  return null;
};

const BusDriverTracking = () => {
  const { driverId } = useParams();

  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDriver = useCallback(async () => {
    if (!driverId) return;

    try {
      const response = await api.get(
        `/api/${encodeURIComponent(driverId)}`
      );

      if (!response.data?.success || !response.data?.driver) {
        setDriver(null);
        setError("Driver not found");
        return;
      }

      setDriver(response.data.driver);
      setError("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load driver details"
      );
    } finally {
      setLoading(false);
    }
  }, [driverId]);

  useEffect(() => {
    loadDriver();

    const interval = setInterval(loadDriver, 5000);

    return () => clearInterval(interval);
  }, [loadDriver]);

  if (loading) {
    return (
      <div className="p-8 text-center">
        Loading driver details...
      </div>
    );
  }

  if (error && !driver) {
    return (
      <div className="p-6 text-center text-red-600">
        {error}
      </div>
    );
  }

  if (!driver) return null;

  // GeoJSON coordinates are [longitude, latitude]
  const coordinates =
    driver.currentLocation?.coordinates;

  const lng = Number(coordinates?.[0]);
  const lat = Number(coordinates?.[1]);

  const hasLocation =
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180 &&
    !(lat === 0 && lng === 0);

  const position = hasLocation ? [lat, lng] : null;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">
          Bus Parcel Tracking
        </h1>

        <div className="bg-white border rounded-2xl shadow-sm p-5 mb-4">
          <h2 className="text-lg font-bold mb-4">
            Driver Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">
                Driver Name
              </p>
              <p className="font-semibold">
                {driver.driverName || "Not available"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Phone Number
              </p>
              <p className="font-semibold">
                <a href={`tel:${driver.phoneNumber}`}>

                {driver.phoneNumber ?? "Not available"}
                </a>
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Driver ID
              </p>
              <p className="font-semibold break-all">
                {driver.driverId}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Bus Number
              </p>
              <p className="font-semibold">
                {driver.busNumber || "Not available"}
              </p>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-500">
            {error
              ? `Location refresh failed: ${error}`
              : "Refreshing driver information every 5 seconds"}
          </div>
        </div>

        <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 font-bold">
            Live Bus Location
          </div>

          {position ? (
            <div className="h-[450px] w-full">
              <MapContainer
                center={position}
                zoom={15}
                scrollWheelZoom
                className="h-full w-full"
              >
                <TileLayer
                  url={`https://maps.geoapify.com/v1/tile/osm-bright-smooth/{z}/{x}/{y}.png?apiKey=${
                    import.meta.env.VITE_GEOAPIFY_KEY
                  }`}
                  attribution="© OpenStreetMap contributors"
                />

                <RecenterMap position={position} />

                <Marker position={position} icon={busIcon}>
                  <Popup>
                    <strong>
                      {driver.driverName || "Bus Driver"}
                    </strong>
                    <br />
                    Bus: {driver.busNumber || "Not available"}
                    <br />
                    Driver ID: {driver.driverId}
                    <br />
                    Latitude: {lat.toFixed(6)}
                    <br />
                    Longitude: {lng.toFixed(6)}
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="text-4xl mb-3">🚌</div>
              <p className="font-semibold">
                Live location not available
              </p>
              <p className="text-sm text-gray-500 mt-2">
                The driver needs to share a valid GPS location.
              </p>
            </div>
          )}

          {position && (
            <div className="p-4 text-sm text-gray-600">
              Coordinates: {lat.toFixed(6)}, {lng.toFixed(6)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BusDriverTracking;

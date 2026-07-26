import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./navbar";
import Footer from "./Footer";
import api from "../api";

const Home = () => {
  const navigate = useNavigate();

  const [merchants, setMerchants] = useState([]);
  const [loadingLoc, setLoadingLoc] = useState(false);
  const [locationError, setLocationError] = useState("");

  const fetchMerchant = async () => {
    try {
      const res = await api.get("/api/home", {
        withCredentials: true,
      });

      setMerchants(res.data.merchants || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMerchant();
  }, []);

  const changeLocation = async () => {
    setLoadingLoc(true);
    setLocationError("");

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported.");
      setLoadingLoc(false);
      return;
    }

    try {
      const permission = await navigator.permissions.query({
        name: "geolocation",
      });

      if (permission.state === "denied") {
        setLocationError(
          "Location permission is blocked. Please enable it in browser settings."
        );
        setLoadingLoc(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            await api.put(
              "/api/user/location",
              {
                latitude: position.coords.latitude.toFixed(6),
                longitude: position.coords.longitude.toFixed(6),
              },
              {
                withCredentials: true,
              }
            );

            await fetchMerchant(); // Refresh merchants
          } catch (err) {
            console.log(err);
            setLocationError("Failed to update location.");
          } finally {
            setLoadingLoc(false);
          }
        },
        (err) => {
          console.log(err);
          setLocationError(err.message);
          setLoadingLoc(false);
        }
      );
    } catch (err) {
      console.log(err);
      setLocationError("Unable to access location.");
      setLoadingLoc(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-md p-5">

          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold">Nearby Merchants</h2>

            <button
              onClick={changeLocation}
              disabled={loadingLoc}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
            >
              {loadingLoc ? "Updating..." : "📍 Change Location"}
            </button>
          </div>

          {locationError && (
            <p className="text-red-500 mb-4">{locationError}</p>
          )}

          {merchants.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {merchants.map((merchant) => (
                <button
                  key={merchant._id}
                  onClick={() => navigate(`/merchant?id=${merchant._id}`)}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl p-4"
                >
                  <h3 className="font-semibold">{merchant.companyName}</h3>
                  <p className="text-sm mt-1">View Products →</p>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <h3 className="text-lg font-semibold">
                No Nearby Merchants
              </h3>
              <p className="text-gray-500 mt-2">
                We are not available in your area right now.
              </p>

              <button
                onClick={changeLocation}
                disabled={loadingLoc}
                className="mt-5 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
              >
                {loadingLoc ? "Updating..." : "Change Location"}
              </button>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Home;
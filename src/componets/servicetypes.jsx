import { useEffect, useState } from "react";
import api from "../api";

export default function ServerTypes() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const load = async () => {
        try{
          const res = await api.get("/api/services", {});

          setServices(res.data.serviceTypes);
        } catch (err) {
          console.log(err);
        } finally {
          setLoading(false);
        }
      }
      load()
  }, []);

  if (loading) return <h2>Loading...</h2>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {services.includes("bike_parcel") && (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold">🏍 Bike Parcel</h2>
          <p>Fast parcel delivery within 5 km.</p>
        </div>
      )}

      {services.includes("goods_auto") && (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold">🛺 Goods Auto</h2>
          <p>Transport heavy goods nearby.</p>
        </div>
      )}

      {services.includes("auto_passenger") && (
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold">🚖 Passenger Auto</h2>
          <p>Book an auto ride instantly.</p>
        </div>
      )}

      {services.length === 0 && (
        <div className="col-span-full text-center py-10">
          No services available nearby.
        </div>
      )}
    </div>
  );
}
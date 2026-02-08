import { useEffect, useState } from "react";
import api from "../api";

export default function AdminAvailability({ adminId }) {
  const [availability, setAvailability] = useState(null);

  useEffect(() => {
    if(!adminId) return;

    api.get(`/api/${adminId}/availability`)
      .then(res => setAvailability(res.data))
      .catch(err => console.error(err));
  }, [adminId]);

  if (!availability) return <p>Loading...</p>;

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl font-bold">Admin Availability</h2>
      <p><strong>Days:</strong> {availability.availableDays.join(", ")}</p>
      <p><strong>Time:</strong> {availability.availableTime.start} - {availability.availableTime.end}</p>
    </div>
  );
}

import { useEffect, useState } from "react";
import api from '../api.js'

export default function AdminAvailabilityForm() {
  const [days, setDays] = useState([]);
  const [time, setTime] = useState({ start: "", end: "" });
  const [adminId, setadminId] = useState('')

  const handleDayChange = (day) => {
    setDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };


  useEffect(() => {
    const admin = async() => {
      try {
        await api.get('/api/adminid',{withCredentials: true})
        .then((res) => setadminId(res.data.id))
        .catch((err) => console.log(err))
      } catch (error) {
        console.log(error)
      }
    }
    admin()
  },[])

   useEffect(() => {
    if (!adminId) return; // ✅ don't run until we have an ID

    api.get(`/api/${adminId}/availability`)
      .then(res => {
        setDays(res.data.availableDays || [])
        setTime({
          start: res.data.availableTime?.start || " ",
          end: res.data.availableTime?.end || " ",
        })
      })
      .catch(err => console.error(err));
  }, [adminId]);

  // if (!availability) return <p>Loading...</p>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/${adminId}/availability`, {
        availableDays: days,
        availableTime: time,
      },{withCredentials: true});
      alert("Availability updated!");
    } catch (err) {
      console.error(err);
    }
  };

  const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded space-y-4">
      <h2 className="text-xl font-bold">Set Availability</h2>

      <div>
        <p className="font-semibold">Select Days:</p>
        {weekdays.map((day) => (
          <label key={day} className="block">
            <input
              type="checkbox"
              checked={days.includes(day)}
              onChange={() => handleDayChange(day)}
            />
            {day}
          </label>
        ))}
      </div>
        <hr />
      <div>
        <p className="font-semibold">Set Time:</p>
        <label>
          Start:{" "}
          <input
            type="time"
            value={time.start}
            onChange={(e) => setTime({ ...time, start: e.target.value })}
          />
        </label>
        <label className="ml-4">
          End:{" "}
          <input
            type="time"
            value={time.end}
            onChange={(e) => setTime({ ...time, end: e.target.value })}
          />
        </label>
      </div>

      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
        Save
      </button>
    </form>
  );
}

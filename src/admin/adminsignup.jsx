import { useState } from 'react'
import api from '../api';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';



const ADMINsignup = () => {

  const [adminsignup, setadminsignup] = useState('');
  const [city, setcity] = useState('city');
  const [latitude, setlatitude] = useState(null);
  const [longitude, setlongitude] = useState(null);
  const [error, setError] = useState('');
  const [success, setsuccess] = useState('');
  const navigate = useNavigate();


  function handleNUMChange(e) {
    const value = e.target.value;
    // Allow only numbers
    if (/^\d*$/.test(value)) {
      setadminsignup(value);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (city === 'city') {
      alert(`use live location`)
    }

    try {
      await api.post("/api/admin", {
        number: adminsignup,
        city: city,
        latitude: latitude,
        longitude: longitude
      },
        { withCredentials: true })
        .then((res) => {
          setsuccess(res.data.message)
          if (res.data.message === "otp sent" || res.data.success === true) {
            navigate('/admin/verify')
          }
        })


    } catch (err) {
      if (err.response) {
        setError(err.response.data.message); // Server error
      } else {
        setError("Network error"); // Network error
      }
    }

  };

  const getcitybylatlan = async () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lon = pos.coords.longitude.toFixed(6);

        console.log(`lat : ${lat} lon : ${lon}`);


        try {
          const res = await axios.get(
            "https://api.geoapify.com/v1/geocode/reverse",
            {
              params: {
                lat,
                lon,
                format: "json",
                apiKey: import.meta.env.VITE_GEOAPIFY_KEY,
              },
            }
          );

          console.log(res.data.results[0].city)
          setcity(res.data.results[0].city)
          setlatitude(lat);
          setlongitude(lon);

        } catch (err) {
          console.error(err);
          setError("Failed to fetch city");
        }
      },
      (err) => setError(err.message),
      { enableHighAccuracy: true }
    );
  };

  return (
    <div>
      <div className="h-screen flex flex-col justify-center items-center ">
        <div className="flex flex-col items-center w-70 h-auto rounded px-5 p-4 shadow-xl/65 shadow-black inset-shadow-sm inset-shadow-indigo-500 ">
          <h2 className="font-bold text-3xl mt-10"  >admin</h2>
          <form action="post" className="items-center p-2 pb-0.5" onSubmit={handleSubmit} >

            <input
              type='tel'
              name='adminsignup'
              placeholder='Number'
              autoComplete='tel'
              minLength={10}
              maxLength={10}
              value={adminsignup}
              onChange={handleNUMChange}
              required
              className="w-full px-3 py-3 border-b-2 outline-none mt-4 h-10"

            />

            <button
              type='button'
              onClick={getcitybylatlan}
              className={`border w-full px-3 py-2 rounded btn-primary`}
            >
              Use Live Location 📍
            </button>
            <h1>{city}</h1>


            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: "greenyellow" }}>{success}</p>}


            <button type='submit' className="w-full my-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition duration-300"> send otp </button>
          </form>

          {/* <button
      onClick={() => navigate(-1)}
      className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
    >
      ← Go Back
    </button> */}
        </div>
      </div>
    </div>
  )
}

export default ADMINsignup

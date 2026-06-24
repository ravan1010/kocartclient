import { useState } from 'react'
import api from '../api';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ToAddress = () => {
    
    //inputs
    const [Fullname, setFullname] = useState('');
    const [FHBCA, setFHBCA] = useState('');
    const [ASSV, setASSV] = useState('');
    const [Landmark, setLandmark] = useState('');
    const [pincode, setpincode] = useState('');
    const [cityTown, setcityTown] = useState('');
    const [state, setstate] = useState('karnataka');

    const [oneclick, setOneclick] = useState(false)

  
    // const [suggestionsCity, setSuggestionsCity] = useState([]);
    const [success, setsuccess] = useState('');
    const [error, setError] = useState('');
    // const [check, setcheck] = useState('')
    const navigate = useNavigate();

   
    //submit handle

    const handleSubmit = async (e) => {
        e.preventDefault();

    try {

      setOneclick(true)

        await api.post("/api/to/address",{ 
            Fullname : Fullname,
            FHBCA: FHBCA,
            ASSV: ASSV,
            Landmark: Landmark,
            pincode: pincode,
            cityTown: cityTown,
            state: state,

        },
         { withCredentials: true })
         .then((res) => {
            setsuccess(res.data.message)
            if(res.data.message === "ok"){
              setFullname('')
              setFHBCA('')
              setASSV('')
              setLandmark('')
              setcityTown('')
              setpincode('')
              setOneclick(false)
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

  return (
    <div className="min-h-screen flex justify-center items-start bg-gray-100 p-4">
  <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-5">

    {/* Back */}
    <Link to="/profile" className="inline-flex items-center mb-3 text-gray-600 hover:text-black">
      <ArrowLeft size={22} />
    </Link>

    <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
      Address Details
    </h2>

    <form onSubmit={handleSubmit} className="space-y-4">

      {/* Full Name */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Full Name
        </label>
        <input
          type="text"
          maxLength={15}
          value={Fullname}
          onChange={(e) => setFullname(e.target.value)}
          required
          className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* House */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Flat / House / Building
        </label>
        <input
          type="text"
          maxLength={25}
          value={FHBCA}
          onChange={(e) => setFHBCA(e.target.value)}
          required
          className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Area */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Area / Street / Village
        </label>
        <input
          type="text"
          maxLength={25}
          value={ASSV}
          onChange={(e) => setASSV(e.target.value)}
          required
          className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Landmark */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Landmark
        </label>
        <input
          type="text"
          placeholder="Near hospital, school, etc"
          maxLength={25}
          value={Landmark}
          onChange={(e) => setLandmark(e.target.value)}
          required
          className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Pincode */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Pincode
        </label>
        <input
          type="text"
          placeholder="6-digit pincode"
          maxLength={6}
          value={pincode}
          onChange={(e) => setpincode(e.target.value)}
          required
          className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* City */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          City / Town
        </label>
        <input
          type="text"
          maxLength={25}
          value={cityTown}
          onChange={(e) => setcityTown(e.target.value)}
          required
          className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* State */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">
          State
        </label>
        <input
          type="text"
          maxLength={25}
          value={state}
          onChange={(e) => setstate(e.target.value)}
          required
          className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Messages */}
      {success && (
        <p className="text-green-600 text-sm font-medium">{success}</p>
      )}
      {error && (
        <p className="text-red-600 text-sm font-medium">{error}</p>
      )}

      {/* Button */}
      <button
        disabled = {oneclick}
        type="submit"
        className={`w-full mt-6 py-3 rounded-xl text-lg font-semibold transition
        ${oneclick
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700"
            }`}
            >
        Save
      </button>

    </form>
  </div>
</div>

  )
}

export default ToAddress

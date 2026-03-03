import { useState } from 'react'
import api from '../api';
import { useNavigate } from 'react-router-dom';
import axios from "axios";


const AdminAddress = () => {

  //inputs

  const [companyName, setcompanyName] = useState('');
  const [category, setcategory] = useState('foodANDbeverages');
  const [FHBCA, setFHBCA] = useState('');
  const [ASSV, setASSV] = useState('');
  const [Landmark, setLandmark] = useState('');
  const [pincode, setpincode] = useState('');
  const [cityTown, setcityTown] = useState('');
  const [city, setcity] = useState('')
  const [state, setstate] = useState('karnataka');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);


  // const [suggestionsCity, setSuggestionsCity] = useState([]);
  const [success, setsuccess] = useState('');
  const [error, setError] = useState('');
  // const [check, setcheck] = useState('')
  const navigate = useNavigate();


  //    const handleFiles = async (e) => {
  //       const files = Array.from(e.target.files);

  //       if(files.length > 2){
  //          alert("You can only upload up to 3 files.");
  //           e.target.value = ''; // Clear the input
  //           return;
  //       }
  //       const base64List = await Promise.all(
  //         files.map(file => toBase64(file))
  //       );
  //       setimage(base64List);

  //     };

  //     const toBase64 = (file) => {
  //     return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => resolve(reader.result);
  //     reader.onerror = error => reject(error);
  //   });
  // };

  //submit handle


  const getcitybylatlan = async () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lon = pos.coords.longitude.toFixed(6);

        setLatitude(lat);
        setLongitude(lon);

        console.log(`lat : ${lat} lon : ${lon}`);

        try {
          const res = await axios.get(
            "https://api.geoapify.com/v1/geocode/reverse",
            {
              params: {
                lat,
                lon,
                format: "json",
                apiKey: "9101d57bd3a34d2194bb8222a55a6a3f",
              },
            }
          );

          console.log(res.data.results[0].city)
          setcity(res.data.results[0].city)
        } catch (err) {
          console.error(err);
          setError("Failed to fetch city");
        }
      },
      (err) => setError(err.message),
      { enableHighAccuracy: true }
    );
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!latitude) {
      return setError('location requied')
    }


    // if(!image){
    //   return setError('select image')
    // }

    try {
      await api.post("/api/admin/info", {
        companyName: companyName,
        category: category,
        FHBCA: FHBCA,
        ASSV: ASSV,
        Landmark: Landmark,
        pincode: pincode,
        cityTown: cityTown,
        state: state,
        city: city,
        latitude: latitude,
        longitude: longitude,

      },
        { withCredentials: true })
        .then((res) => {
          setsuccess(res.data.success)
          if (res.data.success === true) {
            navigate(`/adminlandmark/dashboard`)
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
    <div>
      <div className="h-screen flex flex-col items-center ">
        <h1>Kzone admins</h1>
        <div className="flex flex-col md:w-150 h-auto rounded px-5 p-4 border-1 ">
          <form action="post" className="items-center md:w-full p-2 pb-0.5" onSubmit={handleSubmit} >
            <h2 className="font-bold text-2xl mt-4 mb-3 float-right mr-10"   >Name and Category</h2>

            <div className='p-5 border-b-10 border-l-2 '>

              <input
                type="text"
                name='companyName'
                placeholder='shop, store, resturant name '
                autoComplete='on'
                maxLength={25}
                value={companyName}
                onChange={(e) => setcompanyName(e.target.value)}
                required
                className="w-full px-3 py-3 border-1 outline-none mb-4 h-10"
              />

              <label htmlFor="category" >Choose category </label>
              <select
                value={category}
                id='category'
                onChange={(e) => setcategory(e.target.value)}
                className="w-full px-3 py-0 border-1 outline-none overflow-scroll mb-0 h-10"
              >
                <option value="FoodANDbeverages">Food & Beverages</option>
                <option value="groceryFruitsANDvegetables">grocery fruits and vegetables</option>
                <option value="BooksANDStationery">Books & Stationery</option>
                <option value="FashionANDApparel">Fashion & Apparel</option>
                <option value="ElectronicsANDGadgets">Electronics & Gadgets</option>
                <option value="BeautyANDPersonalCare">Beauty & Personal Care</option>
                <option value="HomeANDLiving">Home & Living</option>
                <option value="SportsANDOutdoors">Sports & Outdoors</option>
                <option value="ToysANDGames">Toys & Games</option>
              </select>

              <button
                type="button"
                onClick={getcitybylatlan}
                className="mt-3 bg-green-600 text-white px-4 py-2 rounded"
              >
                📍 Get Live Location
              </button>

              {latitude && longitude && (
                <p className="text-sm mt-2">
                  {city}
                </p>
              )}

            </div>
            <h2 className="font-bold text-2xl mt-3 mb-3 float-right mr-10"   >Address</h2>
            <div className='p-5 border-t-10 border-r-2 mb-1.5 '>
              <label htmlFor='FHBCA' >Flat, House no, Building, Company, Apartment</label>
              <input
                type="text"
                name='FHBCA'
                id='FHBCA'
                autoComplete='on'
                maxLength={25}
                value={FHBCA}
                onChange={(e) => setFHBCA(e.target.value)}
                required
                className="w-full px-3 py-3 border-1 outline-none mt-0 h-10"
              />

              <label htmlFor='ASSV' >Area, Street, Sector, Village</label>
              <input
                type="text"
                name='ASSV'
                id='ASSV'
                autoComplete='on'
                maxLength={25}
                value={ASSV}
                onChange={(e) => setASSV(e.target.value)}
                required
                className="w-full px-3 py-3 border-1 outline-none mt-0 h-10"
              />

              <label htmlFor='Landmark' >Landmark</label>
              <input
                type="text"
                name='Landmark'
                id='Landmark'
                placeholder='Ex, near hospital, school, collage, medital'
                autoComplete='on'
                maxLength={25}
                value={Landmark}
                onChange={(e) => setLandmark(e.target.value)}
                required
                className="w-full px-3 py-3 border-1 outline-none mt-0 h-10"
              />

              <label htmlFor='pincode' >Pincode</label>
              <input
                type="text"
                name='pincode'
                id='pincode'
                placeholder='6-digit pincode'
                autoComplete='on'
                maxLength={25}
                value={pincode}
                onChange={(e) => setpincode(e.target.value)}
                required
                className="w-full px-3 py-3 border-1 outline-none mt-0 h-10"
              />

              <label htmlFor='cityTown' >City/Town</label>
              <input
                type="text"
                name='cityTown'
                id='cityTown'
                autoComplete='on'
                maxLength={25}
                value={cityTown}
                onChange={(e) => setcityTown(e.target.value)}
                required
                className="w-full px-3 py-3 border-1 outline-none mt-0 h-10"
              />

              <label htmlFor='state' >state</label>
              <input
                type="text"
                name='state'
                id='state'
                autoComplete='on'
                maxLength={25}
                value={state}
                onChange={() => setstate(state)}
                required
                className="w-full px-3 py-3 border-1 outline-none mt-0 h-10"
              />
            </div>

            {
              success ? <p style={{ color: 'greenyellow' }} >{success}</p>
                :
                <p style={{ color: 'red' }}>{error}</p>
            }

            <button type='submit' className="w-full my-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition duration-300"> Next </button>
          </form>


        </div>
      </div>
    </div>
  )
}

export default AdminAddress

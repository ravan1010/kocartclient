
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './navbar';
import Footer from './Footer';
import { useEffect, useState } from 'react';
import useSaveLocation from "../hooks/useSaveLocation";
import api from '../api';

// import ImageSliderforAds from './ads';

const Home = () => {


const navigate = useNavigate();

    useSaveLocation();
    const {merchants, setmerchants} = useState([])

    useEffect(() => {
      const fetchmarchent = async () => {
        try {
          await api.get('/api/home')
          .then((res) => {
            setmerchants(res.data.merchants)

          })
        } catch (error) {
          console.log(error)
        }
      }

      fetchmarchent()

    },[])

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50">

  <div className="flex gap-3 overflow-x-auto py-3">
  {Array.isArray(merchants) && merchants.length > 0 ? (
    merchants.map((merchant) => (
      <button
        key={merchant._id}
        onClick={() => navigate(`/merchant?id=${merchant._id}`)}
        className="px-5 py-2 rounded-full bg-blue-500 text-white whitespace-nowrap"
      >
        {merchant.companyName}
      </button>
    ))
  ) : (
    <p className="text-gray-500 px-4">
      We are not available in your area.
    </p>
  )}
</div>

        <Footer />
      </div>
    </>
  )
}

export default Home;

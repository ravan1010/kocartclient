import  { useState } from 'react';
import {  Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './navbar';
import Footer from './Footer';
import OrganizerCard from './OrganizerCard';
import api from '../api';

// import ImageSliderforAds from './ads';

const Home = () => {

  const navigate = useNavigate();
  // const [query, setQuery] = useState('');

 
    const [product, setproduct] = useState([]); // ✅ array not string
    const [loading, setLoading] = useState(false);
    const [city, setcity] = useState()
    
      const productSchema = async () => {
        try {
          setLoading(true);
          const res = await api.get("/api/home", { withCredentials: true });
          
          // console.log("API response:", res.data);
            console.log(res.data.city)
                        setcity(res.data.city)


          // ✅ Adjust depending on API shape
          if (Array.isArray(res.data)) {
            setproduct(res.data.post);
          } else if (res.data) {
            setproduct(res.data);
          } else {
            setproduct([res.data]);
          }

        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
};

  useEffect(() => {
    productSchema();
  }, []);

 
   
    useEffect(() => {
       const isOnlyPath = !location.search && !location.hash;
       const isNotHome = location.pathname !== "/";
   
       if (isOnlyPath && isNotHome) {
         navigate("/"); // redirect to home
       }
    }, [location, navigate]);
  

  return (
    <>
      <Navbar />
      <div>
      {/* Hero Section */}
      <section className="relative bg-gray-800">
        <div className="absolute inset-0">
           {/* <img src="https://placehold.co/1600x900/1f2937/ffffff?text=Grand+Event" className="w-full h-full object-cover opacity-30" alt="Event background"/> */}
        </div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            order <br /> <span className="text-indigo-400">What you want</span> <br /> {city}
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-300">
            
          </p>
          <div className="mt-8">
            <Link to="/explore">
              <button className="bg-indigo-600 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-indigo-700 transition-transform hover:scale-105">
                Explore
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Whatever the Occasion, We've Got You</h2>
        </div>
      </section>
      
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mx-auto shadow-2xl shadow-black w-[90%]">
      {
        loading ? <p> loading </p> : <p></p>
      }
    {product.length === 0 ? <> </> : <>
            {Array.isArray(product) && product.map(organizer => (
              <OrganizerCard key={organizer._id} organizer={organizer} />
            ))}
            </>}
          </div>
    </div>

      <Footer />
                

  </>
  )}

export default Home;
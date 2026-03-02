
import { Link } from 'react-router-dom';
import Navbar from './navbar';
import Footer from './Footer';
import OrganizerCard from './OrganizerCard';
import useLocation from "../LocationContext";
import useNearbyMerchants from "../useNearbyMerchants";
import { useEffect, useState } from 'react';

// import ImageSliderforAds from './ads';

const Home = () => {

  const { location, locaError, Loadingloc } = useLocation();
  const { grocery, restaurant, loading: merchantLoading } =
    useNearbyMerchants(location);
  const [GroceryData, setGroceryData] = useState([])
  const [ResturantData, setRestaurantData] = useState([])

  useEffect(() => {
    if (grocery && restaurant) {
      setGroceryData(grocery);
      setRestaurantData(restaurant);
      console.log(grocery, restaurant);
    }
  }, [grocery, restaurant]);

  if (Loadingloc) return <p>Detecting location...</p>;
  if (locaError)
    return (
      <div className="text-center mt-10 text-red-500">
        Please turn on location to see nearby merchants
      </div>
    );

  if (merchantLoading) return <p>Finding nearby shops...</p>;

  return (
    <>

      <div>
        <Navbar />
        {/* Hero Section */}
        <div>

          {/* <item section /> */}
          {GroceryData.length === 0 && ResturantData.length === 0 ? (
            <p className="text-center mt-4 text-red-500">Not found within 3km</p>
          ) : (
            <>

              <div className="grid grid-cols-1 md:grid-cols-2 border-l-2 border-b-2 border-gray-200 lg:grid-cols-3 gap-3 p-2">
                {
                  GroceryData.length != 0 && <h2 className="text-2xl font-bold col-span-full">
                    Nearby Grocery Shops
                  </h2>
                }
                <div className="grid grid-cols-3 gap-2">

                  {GroceryData.map((organizer) => (
                    <OrganizerCard key={organizer._id} organizer={organizer} />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 border-l-2 border-b-2 border-gray-200 lg:grid-cols-3 gap-3 p-2">
                {
                  ResturantData.length != 0 && <h2 className="text-2xl font-bold col-span-full">
                    Nearby Restaurants
                  </h2>
                }
                <div className="grid grid-cols-3 gap-2">

                  {ResturantData.map((organizer) => (
                    <OrganizerCard key={organizer._id} organizer={organizer} />
                  ))}
                </div>
              </div>
            </>
          )}


          <Footer />
        </div>
      </div>
    </>
  )
}

export default Home;
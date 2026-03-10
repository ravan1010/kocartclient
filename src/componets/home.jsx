
import { Link } from 'react-router-dom';
import Navbar from './navbar';
import Footer from './Footer';
import OrganizerCard from './OrganizerCard';
import useLocation from "../LocationContext";
import useNearbyMerchants from "../useNearbyMerchants";
import { useEffect, useState } from 'react';

// import ImageSliderforAds from './ads';

const Home = () => {

  const { location, locaError, Loadingloc, turnON } = useLocation();
  const { grocery, restaurant, Open, loading: merchantLoading } =
    useNearbyMerchants(location);
  const [GroceryData, setGroceryData] = useState([])
  const [ResturantData, setRestaurantData] = useState([])

  useEffect(() => {
    const fetchData = () => {
      if (grocery || restaurant) {
        setGroceryData(grocery);
        setRestaurantData(restaurant);
        console.log(grocery, restaurant);
      }
    }
    fetchData();
  }, [grocery, restaurant]);

  const RESgroupedByAuthor = ResturantData.reduce((acc, item) => {
    if (!acc[item.author]) {
      acc[item.author] = [];
    }
    acc[item.author].push(item);
    return acc;
  }, {});

  const GrogroupedByAuthor = GroceryData.reduce((acc, item) => {
    if (!acc[item.author]) {
      acc[item.author] = [];
    }
    acc[item.author].push(item);
    return acc;
  }, {});

  if (Loadingloc) return <p>Detecting location...</p>;
  if (locaError)
    return (
      <>
        <div className="text-center mt-10 text-red-500">
          {locaError}
        </div>

        <div className="flex items-center justify-center mt-4">
          <button
            onClick={turnON}
            className="bg-blue-600 text-white px-4 py-2 rounded-full"
          >
            📍 Turn on Location
          </button>
        </div>
      </>
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
                {Object.entries(GrogroupedByAuthor).map(([author, products]) => (
                  <div key={author} className="mb-6 border-b-2 border-gray-500 pb-4">

                    {/* Author Heading */}


                    {/* Product Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {products.map((organizer) => (
                        <OrganizerCard
                          key={organizer._id}
                          organizer={organizer}
                          Open={Open}
                        />
                      ))}
                    </div>

                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 border-l-2 border-b-2 border-gray-200 lg:grid-cols-3 gap-3 p-2">
                {
                  ResturantData.length != 0 && <h2 className="text-2xl font-bold col-span-full">
                    Nearby Restaurants
                  </h2>
                }
                {Object.entries(RESgroupedByAuthor).map(([author, products]) => (
                  <div key={author} className="mb-6 border-b-2 border-gray-500 pb-4">

                    {/* Author Heading */}


                    {/* Product Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {products.map((organizer) => (
                        <OrganizerCard
                          key={organizer._id}
                          organizer={organizer}
                          Open={Open}
                        />
                      ))}
                    </div>

                  </div>
                ))}
                {/* <div className="grid grid-cols-2 gap-2">

                  {ResturantData.map((organizer) => (
                    <OrganizerCard key={organizer._id} organizer={organizer} Open={Open} />
                  ))}
                </div> */}
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
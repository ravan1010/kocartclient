
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
  const [selectedEvent, setSelectedEvent] = useState("all");

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

  // Unique Restaurant Names
  const uniqueEvents = [
    "all",
    ...new Set(
      ResturantData.map((item) => item.variantname)
    ),
  ];

  // Filter Restaurants
  const filteredRestaurants =
    selectedEvent === "all"
      ? ResturantData
      : ResturantData.filter(
        (item) => item.variantname === selectedEvent
      );




  const RESgroupedByAuthor = filteredRestaurants.reduce((acc, item) => {
    if (!acc[item.author]) {
      acc[item.author] = [];
    }
    acc[item.author].push(item);
    return acc;
  }, {});



  // const GrogroupedByAuthor = GroceryData.reduce((acc, item) => {
  //   if (!acc[item.author]) {
  //     acc[item.author] = [];
  //   }
  //   acc[item.author].push(item);
  //   return acc;
  // }, {});

  if (Loadingloc) return <><Navbar /> <p>Detecting location...</p></>;
  if (locaError)
    return (
      <>
        <Navbar />
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

  if (merchantLoading) return <><Navbar /> <p>Finding nearby Resturant...</p></>;

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50">

        {ResturantData.length === 0 ? (
          <p className="text-center mt-4 text-red-500">
            Not found within 5km
          </p>
        ) : (
          <div className="p-2">

            <h2 className="text-2xl font-bold mb-4">
              Nearby Restaurants
            </h2>

            {/* Filter Buttons */}
            <div className="flex gap-3 overflow-x-auto scrollbar-hide py-2 mb-6">

              {uniqueEvents.map((event) => (
                <button
                  key={event}
                  onClick={() => setSelectedEvent(event)}
                  className={`
                  whitespace-nowrap
                  px-5 py-2
                  rounded-full
                  font-medium
                  transition-all
                  duration-300
                  border
                  ${selectedEvent === event
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                    }
                `}
                >
                  {event}
                </button>
              ))}

            </div>

            {/* Products */}
            {Object.entries(RESgroupedByAuthor).map(
              ([author, products]) => (
                <div
                  key={author}
                  className="mb-8 border-b border-gray-200 pb-4"
                >

                  <h3 className="text-xl font-bold mb-4">
                    {products[0]?.companyName}
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">

                    {products.map((organizer) => (
                      <OrganizerCard
                        key={organizer._id}
                        organizer={organizer}
                        Open={Open}
                      />
                    ))}

                  </div>

                </div>
              )
            )}
          </div>
        )}
        <Footer />
      </div>
    </>
  )
}

export default Home;

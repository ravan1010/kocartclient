// src/pages/Explore.jsx
import React, { useEffect, useState } from 'react';
import OrganizerCard from './OrganizerCard';
// import { SlidersHorizontal } from 'lucide-react';
import api from '../api';
import Navbar from './navbar';
import Footer from './Footer';

const Explore = () => {
  const [organizersData, setorganizersData] = useState([])
  const [filters, setFilters] = useState({
    name: '',
    companyName: '',
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const fetchEventData = async () => {
    try {
      const res = await api.get('/api/explore', { withCredentials: true });
      setorganizersData(res.data);
    } catch (error) {
      console.error("Error fetching event data:", error);
    }
  };

  useEffect(() => {
    fetchEventData();
  }, []);

  const filteredOrganizers = organizersData.filter(org => {
    const nameMatch = filters.name ? org.name.toLowerCase().includes(filters.name.toLowerCase()) : true;
    const companyNameMatch = filters.companyName ? org.companyName.toLowerCase().includes(filters.companyName.toLowerCase()) : true;
    return nameMatch && companyNameMatch
  });

  // const Eventcategorys = ['All', 'birthday', 'wedding'];

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">
              Explore Items
            </h1>
            <p className="text-gray-500 mt-1">
              Discover items from nearby restaurants & stores
            </p>
          </div>

          {/* Filter Bar */}
          <div className="bg-white p-6 rounded-2xl shadow-sm mb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Item Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Item
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={filters.name}
                  onChange={handleFilterChange}
                  placeholder="Search item"
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              {/* Store Name */}
              <div>
                <label
                  htmlFor="companyName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Restaurant / Store
                </label>
                <input
                  type="text"
                  name="companyName"
                  id="companyName"
                  value={filters.companyName}
                  onChange={handleFilterChange}
                  placeholder="e.g. Pizza Hut, Grocery"
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

            </div>
          </div>

          {/* Results */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {filteredOrganizers.length} Items Found
              </h2>
            </div>

            {filteredOrganizers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredOrganizers.map((organizer) => (
                  <OrganizerCard key={organizer._id} organizer={organizer} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">
                  No items match your search 😕
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  Try adjusting filters or search terms
                </p>
              </div>
            )}
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
};

export default Explore;
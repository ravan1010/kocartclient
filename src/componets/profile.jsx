import api from '../api';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import ADMINMainauth from '../admin/auth/adminMainauth';
import Navbar from './navbar';
import useAuthCheck from '../signup/auth/atokenauth';
import Footer from './Footer'
import { logout } from '../login/logout';

const Profile = () => {

    const [number, setnumber] = useState()
    const { admin } = ADMINMainauth();
    const { user } = useAuthCheck()
    const [toadmin, settoadmin] = useState('')
    const [showConfirm, setShowConfirm] = useState(false);

    
     const fetchtoadmin = async () => {
      const res = await api.get(`/api/toadmin`, {withCredentials: true} );
      if(res.data.success === true){
      settoadmin('adminlandmark');
      }
    };
  
    useEffect(() => {
      fetchtoadmin();
    }, []);


     const fetchnumber = async () => {
        const res = await api.get(`/api/setting`, {withCredentials: true} )
        setnumber(res.data.number);      
      };
    
      useEffect(() => {
        fetchnumber();
      }, []);

      // const handleLogout = () => {
      //   const confirmLogout = window.confirm("Are you sure you want to logout?");
      //   if(confirmLogout){
      //     return
      //   }
      // };

  return (
    <>
    <Navbar />

<div className="min-h-screen bg-gray-100 pt-5 lg:pt-20">
  
  {/* Profile Header */}
  <div className="bg-white shadow-sm px-5 py-4 border-b">
    <h1 className="font-bold text-2xl text-gray-800">
      {number ? number : "User"}
    </h1>
    <p className="text-sm text-gray-500">My Account</p>
  </div>

  {/* Menu */}
  <div className="px-5 mt-6 space-y-3">

    <Link
      to="/address-list"
      className="block bg-white rounded-xl shadow-sm p-4 text-gray-700 font-medium hover:shadow-md transition"
    >
      📍 Address List
    </Link>

    {/* {user ? (
      <button
        onClick={() => setShowConfirm(true)}
        className="w-full text-left bg-white rounded-xl shadow-sm p-4 text-red-600 font-medium hover:shadow-md transition"
      >
        🚪 Logout
      </button>
    ) : (
      <Link
        to="/signup"
        className="block bg-white rounded-xl shadow-sm p-4 text-blue-600 font-medium hover:shadow-md transition"
      >
        🔐 Login / Signup
      </Link>
    )} */}

    {admin ? (
      <Link
        to={`/${toadmin}/dashboard`}
        className="block bg-white rounded-xl shadow-sm p-4 text-gray-700 font-medium hover:shadow-md transition"
      >
        🧑‍💼 Partner Dashboard
      </Link>
    ) : (
      <Link
        to="/admin"
        className="block bg-white rounded-xl shadow-sm p-4 text-gray-700 font-medium hover:shadow-md transition"
      >
        🤝 Become a Partner
      </Link>
    )}

  </div>

  {/* Logout Modal */}
  {/* {showConfirm && (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-[90%] max-w-sm shadow-xl">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">
          Confirm Logout
        </h2>
        <p className="text-gray-600 mb-4">
          Are you sure you want to logout?
        </p>

        <div className="flex gap-3">
          <button
            onClick={logout}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition"
          >
            Yes
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            className="flex-1 bg-gray-200 hover:bg-gray-300 py-2 rounded-lg transition"
          >
            No
          </button>
        </div>
      </div>
    </div>
  )} */}

  <Footer />
</div>

    </>
  )
}

export default Profile

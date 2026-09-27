import api from "../api";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./navbar";

const Profile = () => {

  const [number, setNumber] = useState("");
  const [auto, setauto] = useState();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const settingRes = await api.get("/api/setting", { withCredentials: true })

        console.log(settingRes.data)
        setNumber(settingRes.data.number || "");
        setauto(settingRes.data.autobooking || 0);



      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 pt-5 lg:pt-20">
        <div className="bg-white shadow-sm px-5 py-4 border-b">
          <h1 className="font-bold text-2xl text-gray-800">
            {number || "User Profile"}
          </h1>
          <p className="text-sm text-gray-500">My Account</p>
        </div>

        <div className="px-5 mt-6 space-y-3">

          {auto !== 0 && (
            <Link
              to="/auto/all/orders"
              className="block bg-white rounded-xl shadow-sm p-4 text-gray-700 font-medium hover:shadow-md transition"
            >
              Bookings
            </Link>
          )}
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Profile;
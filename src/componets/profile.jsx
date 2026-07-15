import api from "../api";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./navbar";
import Footer from "./Footer";
import useAdminauth from "../admin/auth/adminotpauth";

const Profile = () => {
  const { isAdmin } = useAdminauth();

  const [number, setNumber] = useState("");
  const [toadmin, setToadmin] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingRes, adminRes] = await Promise.all([
          api.get("/api/setting", { withCredentials: true }),
          api.get("/api/toadmin", { withCredentials: true }),
        ]);

        setNumber(settingRes.data.number || "");

        if (adminRes.data.success) {
          setToadmin(adminRes.data.slug || "adminlandmark");
          console.log(toadmin)
        }
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
          <Link
            to="/address-list"
            className="block bg-white rounded-xl shadow-sm p-4 text-gray-700 font-medium hover:shadow-md transition"
          >
            📍 Address List
          </Link>

          <a
            href="https://expo.dev/artifacts/eas/CGqk7laCaV8kMaKBjMeQZH9CMt2Qrw2C2s4DmeX9ABg.apk"
            className="block bg-white rounded-xl shadow-sm p-4 text-gray-700 font-medium hover:shadow-md transition"
          >
            Download
          </a>

          {isAdmin ? (
              <Link
                to={`/adminlandmark/dashboard`}
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

        <Footer />
      </div>
    </>
  );
};

export default Profile;
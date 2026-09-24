
import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Home, ClipboardList, User } from "lucide-react";

const Navbar = () => {
  const { pathname } = useLocation();

  const navLinkClasses = ({ isActive }) =>
    isActive
      ? "text-indigo-600 font-bold"
      : "text-gray-600 hover:text-indigo-600 transition-colors";

  return (
    <>
      {/* TOP NAVBAR */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex justify-between items-center">

          {/* LOGO */}
          <Link to="/" className="text-2xl font-bold text-gray-800">
            
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center space-x-8">

            <NavLink to="/" className={navLinkClasses}>
              Home
            </NavLink>

            <NavLink to="/auto/all/orders" className={navLinkClasses}>
              My Bookings
            </NavLink>

            <NavLink to="/profile" className={navLinkClasses}>
              Profile
            </NavLink>

            <NavLink to="https://parcelandtransport.kocart.online" className={navLinkClasses}>
              Become a Partner
            </NavLink>

          </div>
        </div>
      </nav>

      {/* MOBILE BOTTOM NAV */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">

        <div className="flex justify-around items-center h-16">

          {/* HOME */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex flex-col items-center text-xs ${
                isActive ? "text-indigo-600" : "text-gray-500"
              }`
            }
          >
            <Home size={22} />
            <span>Home</span>
          </NavLink>

          {/* BOOKINGS */}
          <NavLink
            to="/auto/all/orders"
            className={({ isActive }) =>
              `flex flex-col items-center text-xs ${
                isActive ? "text-indigo-600" : "text-gray-500"
              }`
            }
          >
            <ClipboardList size={22} />
            <span>Bookings</span>
          </NavLink>

          {/* PROFILE */}
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex flex-col items-center text-xs ${
                isActive ? "text-indigo-600" : "text-gray-500"
              }`
            }
          >
            <User size={22} />
            <span>Profile</span>
          </NavLink>

        </div>
      </div>
    </>
  );
};

export default Navbar;


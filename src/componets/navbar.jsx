// src/components/Navbar.jsx
import React from "react";
import { Link, NavLink } from "react-router-dom";
import { Home, ShoppingCart, Package, User } from "lucide-react";

const Navbar = () => {
  const navLinkClasses = ({ isActive }) =>
    isActive
      ? "text-indigo-600 font-bold"
      : "text-gray-600 hover:text-indigo-600 transition-colors";

  return (
    <>
      {/* TOP NAVBAR */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex justify-between items-center">
          
          <Link to="/" className="text-2xl font-bold text-gray-800">
            KOCART
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/" className={navLinkClasses}>Home</NavLink>
            <NavLink to="/cart" className={navLinkClasses}>Cart</NavLink>
            <NavLink to="/order" className={navLinkClasses}>Order</NavLink>
            <NavLink to="/profile" className={navLinkClasses}>Profile</NavLink>
          </div>
        </div>
      </nav>

      {/* MOBILE BOTTOM NAV */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
        <div className="flex justify-around items-center h-16">

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

          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `flex flex-col items-center text-xs ${
                isActive ? "text-indigo-600" : "text-gray-500"
              }`
            }
          >
            <ShoppingCart size={22} />
            <span>Cart</span>
          </NavLink>

          <NavLink
            to="/order"
            className={({ isActive }) =>
              `flex flex-col items-center text-xs ${
                isActive ? "text-indigo-600" : "text-gray-500"
              }`
            }
          >
            <Package size={22} />
            <span>Orders</span>
          </NavLink>

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
// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const OrderNavbar = () => {

  const navLinkClasses = ({ isActive }) =>
    isActive
      ? 'text-indigo-600 font-bold mx-2 border-4'
      : 'text-gray-600 hover:text-indigo-600 transition-colors mx-2';


  return (
    
          <div className="border-2 my-2 py-2 items-center">
            <NavLink to="/Allorder" className={navLinkClasses} >orders</NavLink>
            <NavLink to="/pending" className={navLinkClasses}>Pending</NavLink>
            <NavLink to="/process" className={navLinkClasses}>Process</NavLink>
            <NavLink to="/cancel" className={navLinkClasses}>Cancel</NavLink>
            <NavLink to="/complete" className={navLinkClasses}>complete</NavLink>
          </div>
  
  
  );
};

export default OrderNavbar;
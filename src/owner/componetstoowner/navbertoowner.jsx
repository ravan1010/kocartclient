// src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const OwnerNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinkClasses = ({ isActive }) =>
    isActive
      ? 'text-indigo-600 font-bold'
      : 'text-gray-600 hover:text-indigo-600 transition-colors';

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-gray-800">
            Food
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/owner" className={navLinkClasses}>home</NavLink>
            <NavLink to="/postaddandremove" className={navLinkClasses}>Post</NavLink>
            <NavLink to="/allorder" className={navLinkClasses}>OrderStatus</NavLink>

          </div>
           <div className="md:hidden">
                      <button onClick={() => setIsOpen(!isOpen)}>
                        {isOpen ? <X size={24} /> : <Menu size={24} />}
                      </button>
                    </div>
                  </div>
                </div>

          {/* Mobile Menu Button */}
          {isOpen && (
                  <div className="md:hidden bg-white border-t pb-4">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                      <NavLink to="/owner" className={({isActive}) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700'}`} onClick={() => setIsOpen(false)}>owner</NavLink>
                      <NavLink to="/postaddandremove" className={({isActive}) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700'}`} onClick={() => setIsOpen(false)}>post</NavLink>
                      <NavLink to="/allorder" className={({isActive}) => `block px-3 py-2 rounded-md text-base font-medium ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700'}`} onClick={() => setIsOpen(false)}>OrderStatus</NavLink>
                  
                    </div>
                  </div>
                )}
    </nav>
  );
};

export default OwnerNavbar;
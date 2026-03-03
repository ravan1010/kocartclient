// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-10">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold"></h3>
            <p className="mt-2 text-gray-400"></p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Explore</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
              <li><Link to="/explore" className="text-gray-400 hover:text-white">Vendors</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-white">About</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">For Vendors</h3>
            <ul className="mt-4 space-y-2">
              <li><Link  className="text-gray-400 hover:text-white">List Your Business</Link></li>
              <li><Link to="/admin" className="text-gray-400 hover:text-white">Partner</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Follow Us</h3>
            <div className='flex flex-col'> 
              <a href="#" className="text-gray-400 hover:text-white">Facebook</a>
              <a href="/" className="text-gray-400 hover:text-white">Instagram</a>
              <a href="#" className="text-gray-400 hover:text-white">Twitter</a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-700 pt-8 text-center text-gray-400">
          &copy; {new Date().getFullYear()} Evently. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
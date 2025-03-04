import React, { useState } from 'react';

export default function Navigation({ isLoggedIn, changePage, logout, user }) {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  return (
    <nav className="bg-indigo-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <a href="#" onClick={() => changePage('home')} className="text-2xl font-bold hover-grow">Panchtantra</a>
        <div className="flex items-center space-x-4">
          <button onClick={() => document.documentElement.classList.toggle('dark')} className="p-2 rounded-full hover:bg-indigo-700 transition-colors duration-300" aria-label="Toggle dark mode">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>
          {!isLoggedIn ? (
            <div className="space-x-4">
              <a href="#" onClick={() => changePage('login')} className="hover:text-indigo-200 transition-colors duration-300">Login</a>
              <a href="#" onClick={() => changePage('signup')} className="hover:text-indigo-200 transition-colors duration-300">Sign Up</a>
            </div>
          ) : (
            <div className="flex items-center space-x-4 relative" onMouseLeave={() => setIsProfileDropdownOpen(false)}>
              <a href="#" onClick={() => changePage('iqtest')} className="hover:text-indigo-200 transition-colors duration-300">IQ Test</a>
              <a href="#" onClick={() => changePage('storygen')} className="hover:text-indigo-200 transition-colors duration-300">Story Generator</a>
              <img 
                src={user?.profilePhoto || "https://via.placeholder.com/50"} 
                alt="Profile Photo" 
                className="w-10 h-10 rounded-full cursor-pointer hover-grow"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              />
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-md shadow-lg py-2 z-20">
                  <a href="#" onClick={() => changePage('profile')} className="block px-4 py-2 hover:bg-indigo-600 hover:text-white transition-colors rounded-md">Go to Profile</a>
                  <a href="#" onClick={logout} className="block px-4 py-2 hover:bg-indigo-600 hover:text-white transition-colors rounded-md">Logout</a>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
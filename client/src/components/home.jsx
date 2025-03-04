import React from 'react';

export default function Home({ changePage }) {
  return (
    <div className="fade-in">
      <h1 className="text-5xl font-bold text-center mb-8 text-indigo-800 dark:text-indigo-200 slide-in">Welcome to Panchtantra</h1>
      <p className="text-xl text-center mb-8 slide-in" style={{ animationDelay: '0.2s' }}>Generate engaging stories for young minds and test your IQ!</p>
      <div className="flex justify-center space-x-4">
        <button 
          onClick={() => changePage('storygen')}  
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-105 pulse"
        >
          Get Started
        </button>
        <button 
          onClick={() => changePage('about')} 
          className="bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 px-6 py-3 rounded-lg hover:bg-indigo-100 dark:hover:bg-gray-700 transition duration-300 transform hover:scale-105"
        >
          Learn More
        </button>
      </div>
    </div>
  );
}

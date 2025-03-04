import React, { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';  // Custom hook for authentication
import './index.css';  // or './App.css' depending on your structure
import Navigation from './components/navigation';
import Home from './components/home';
import Login from './components/login';
import Signup from './components/signup';
import Profile from './components/profile';
import IQTest from './components/iqtest';
import StoryGenerator from './components/storygenerator';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [hasCompletedIQTest, setHasCompletedIQTest] = useState(false);
  const { user, login, logout } = useAuth();  // Custom hook to manage auth state

  useEffect(() => {
    // If a user is logged in, redirect to home page
    if (user) {
      setCurrentPage('home');
      window.location.hash = 'home';
    }
  }, [user]); // Run when 'user' state changes

  useEffect(() => {
    // Handle hash change and load the correct page
    const hash = window.location.hash.substring(1);
    if (hash) {
      setCurrentPage(hash);
    }
  }, []); // Only run once when the component mounts

  const changePage = (page) => {
    // If the requested page is 'storygen', change page immediately
    if (page === 'storygen') {
      setCurrentPage(page);
      window.location.hash = page;
      return;
    }

    // For other pages, check if the IQ test is completed
    if (page === 'storygen' && !hasCompletedIQTest) {
      alert('Please complete the IQ test before accessing the Story Generator.');
      setCurrentPage('iqtest');
      window.location.hash = 'iqtest';
      return;
    }

    setCurrentPage(page);
    window.location.hash = page;
  };

  const completeIQTest = (score, ageGroup) => {
    setHasCompletedIQTest(true);
    // Update user profile with IQ test results
    // This would typically involve an API call to the backend
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Navigation 
        isLoggedIn={!!user}  // Determine if user is logged in
        changePage={changePage} 
        logout={logout}
        user={user}  // Pass user data to Navigation
      />
      <div className="container mx-auto mt-8 p-4">
        {currentPage === 'home' && <Home changePage={changePage} />}
        {currentPage === 'login' && <Login login={login} changePage={changePage} />}
        {currentPage === 'signup' && <Signup login={login} changePage={changePage} />}
        {currentPage === 'profile' && <Profile user={user} completeIQTest={completeIQTest} changePage={changePage} />}
        {currentPage === 'iqtest' && <IQTest completeIQTest={completeIQTest} changePage={changePage} />}
        {currentPage === 'storygen' && <StoryGenerator user={user} />}
      </div>
    </div>
  );
}

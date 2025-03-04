import React, { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

export default function Signup({ login, changePage }) {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/register',
        { name: fullname, email, password }, // Ensure field names match backend
        { withCredentials: true }
      );
      login(response.data); // Save user session on successful signup
      changePage('profile'); // Navigate to profile page
    } catch (error) {
      console.error('Signup error:', error);
      alert(error.response?.data?.message || 'Signup failed. Please try again.');
    }
  };
  
  return (
    <div className="max-w-md mx-auto fade-in">
      <h2 className="text-3xl font-bold mb-4 text-center text-indigo-800 dark:text-indigo-200">Sign Up</h2>
      <form onSubmit={handleSubmit} className="space-y-4 glass-effect p-6">
        <div>
          <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
          <input 
            type="text" 
            id="fullname" 
            value={fullname} 
            onChange={(e) => setFullname(e.target.value)} 
            required 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <input 
            type="email" 
            id="signup-email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
          <input 
            type="password" 
            id="signup-password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <button type="submit" className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md">
          Sign Up
        </button>
      </form>
    </div>
  );
}

Signup.propTypes = {
  login: PropTypes.func.isRequired,
  changePage: PropTypes.func.isRequired,
};

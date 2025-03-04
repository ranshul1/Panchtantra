import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types'; // Import PropTypes

export default function Profile({ user, completeIQTest, changePage }) {
  // Use fallback values in case `user` is not yet available
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [sex, setSex] = useState(user?.sex || '');
  const [age, setAge] = useState(user?.age || '');
  const [education, setEducation] = useState(user?.education || '');
  const [bio, setBio] = useState(user?.bio || '');

  useEffect(() => {
    // Only update the state if the `user` prop is available and has changed
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setSex(user.sex || '');
      setAge(user.age || '');
      setEducation(user.education || '');
      setBio(user.bio || '');
    }
  }, [user]); // Re-run the effect only if `user` changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        'http://localhost:5000/api/users/profile',
        { name, email, sex, age, education, bio },
        { withCredentials: true } // Ensure session cookie is sent
      );
      alert('Profile updated successfully!');
      changePage('iqtest');
    } catch (error) {
      console.error('Profile update error:', error);
      if (error.response && error.response.status === 401) {
        alert('Session expired. Please log in again.');
        changePage('login');
      }
    }
  };
  

  return (
    <div className="max-w-md mx-auto fade-in">
      <h2 className="text-3xl font-bold mb-4 text-center text-indigo-800 dark:text-indigo-200">Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4 glass-effect p-6">
        <div>
          <label htmlFor="profileName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
          <input 
            type="text" 
            id="profileName" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all duration-300"
          />
        </div>
        <div>
          <label htmlFor="profileEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <input 
            type="email" 
            id="profileEmail" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all duration-300"
          />
        </div>
        <div>
          <label htmlFor="profileSex" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Sex</label>
          <input 
            type="text" 
            id="profileSex" 
            value={sex} 
            onChange={(e) => setSex(e.target.value)} 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all duration-300"
          />
        </div>
        <div>
          <label htmlFor="profileAge" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Age</label>
          <input 
            type="number" 
            id="profileAge" 
            value={age} 
            onChange={(e) => setAge(e.target.value)} 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all duration-300"
          />
        </div>
        <div>
          <label htmlFor="profileEducation" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Education</label>
          <input 
            type="text" 
            id="profileEducation" 
            value={education} 
            onChange={(e) => setEducation(e.target.value)} 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all duration-300"
          />
        </div>
        <div>
          <label htmlFor="profileBio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
          <textarea 
            id="profileBio" 
            value={bio} 
            onChange={(e) => setBio(e.target.value)} 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all duration-300"
          ></textarea>
        </div>
        <button type="submit" className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all duration-300 transform hover:scale-105">
          Save Profile
        </button>
      </form>
    </div>
  );
}

// Prop validation
Profile.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    sex: PropTypes.string,
    age: PropTypes.number,
    education: PropTypes.string,
    bio: PropTypes.string,
  }).isRequired,
  completeIQTest: PropTypes.func,
  changePage: PropTypes.func.isRequired,
};

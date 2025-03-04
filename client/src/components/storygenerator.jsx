import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_AI_API_KEY);

const StoryGenerator = () => {
  const [topic, setTopic] = useState('');  // Initialize with an empty string
  const [story, setStory] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [savedStories, setSavedStories] = useState([]);

  useEffect(() => {
    const storedStories = localStorage.getItem('savedStories');
    if (storedStories) {
      setSavedStories(JSON.parse(storedStories));
    }
  }, []);

  const generateStory = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `Generate a story about ${topic}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      setStory(text);
    } catch (error) {
      console.error('Error generating story:', error);
      setStory('Sorry, there was an error generating the story. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fade-in">
      <h2 className="text-3xl font-bold mb-4 text-center text-indigo-800 dark:text-indigo-200">Story Generator</h2>
      <form onSubmit={generateStory} className="mb-8 max-w-2xl mx-auto">
        <input
          type="text"
          value={topic}  // Controlled input
          onChange={(e) => setTopic(e.target.value)}  // Update state correctly
          placeholder="Enter a topic..."
          className="flex-grow p-2 rounded-lg border-2 border-indigo-300"
          required  // Optional: if you want to enforce that the topic cannot be empty
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg"
        >
          {isLoading ? 'Generating...' : 'Generate Story'}
        </button>
      </form>
      {story && (
        <div className="mt-4">
          <h3 className="text-2xl font-semibold">Generated Story:</h3>
          <p className="mt-2">{story}</p>
          {/* Optional: buttons to save, download, etc. */}
        </div>
      )}
    </div>
  );
};

StoryGenerator.propTypes = {
  iqScore: PropTypes.number,  // Removed from props as it's no longer necessary
  mentalAgeGroup: PropTypes.string,  // Removed from props as it's no longer necessary
};

export default StoryGenerator;

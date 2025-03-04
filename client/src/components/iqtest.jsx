import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

const iqQuestions = [
  { question: "What comes next in the sequence: 2, 4, 8, 16, ...?", options: ["24", "32", "48", "64"], correctAnswer: 1 },
  { question: "If a clock shows 3:45, what is the angle between the hour and minute hands?", options: ["90°", "97.5°", "102.5°", "107.5°"], correctAnswer: 2 },
  { question: "Which number should come next in this series? 25, 24, 22, 19, 15", options: ["10", "11", "12", "14"], correctAnswer: 0 },
  { question: "A square has a perimeter of 28 cm. What is its area?", options: ["49 cm²", "56 cm²", "64 cm²", "72 cm²"], correctAnswer: 0 },
  { question: "If you rearrange the letters 'CIFAIPC' you would have the name of a(n):", options: ["City", "Animal", "Ocean", "Country"], correctAnswer: 2 },
  { question: "Which of the following can be arranged into a 5-letter English word?", options: ["H R G S T", "R I L S A", "T O O M T", "W Q R G S"], correctAnswer: 1 },
  { question: "If you multiply this number by any other number, the answer will always be the same. What number is this?", options: ["0", "1", "2", "Any number"], correctAnswer: 0 },
  { question: "Which number should replace the question mark? 8 : 4 :: 10 : ?", options: ["3", "5", "6", "7"], correctAnswer: 1 },
  { question: "Mary is 16 years old. She is 4 times older than her brother. How old will Mary be when she is twice as old as her brother?", options: ["20", "24", "28", "32"], correctAnswer: 1 },
  { question: "Which of the following is the odd one out?", options: ["Copper", "Tin", "Iron", "Sulfur"], correctAnswer: 3 }
];

export default function IQTest({ completeIQTest, changePage }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const startTest = () => setTestStarted(true);

  const selectAnswer = (index) => setSelectedAnswer(index);

  const nextQuestion = () => {
    if (selectedAnswer === iqQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    setCurrentQuestion(currentQuestion + 1);
    setSelectedAnswer(null);

    if (currentQuestion >= iqQuestions.length - 1) {
      completeTest();
    }
  };

  const completeTest = async () => {
    setTestCompleted(true);
    const finalScore = Math.round((score / iqQuestions.length) * 100);
    setScore(finalScore);

    let ageGroup;
    if (finalScore < 70) {
      ageGroup = 'Below Average';
    } else if (finalScore >= 70 && finalScore < 90) {
      ageGroup = 'Average';
    } else if (finalScore >= 90 && finalScore < 110) {
      ageGroup = 'Above Average';
    } else {
      ageGroup = 'Gifted';
    }

    try {
      await axios.put(
        'http://localhost:5000/api/users/profile', 
        { iqScore: finalScore, mentalAgeGroup: ageGroup },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      completeIQTest(finalScore, ageGroup);
    } catch (error) {
      console.error('Error updating IQ score:', error);
    }
  };

  const finishTest = () => {
    changePage('storygen'); // Directly redirect to story generation
  };

  if (!testStarted) {
    return (
      <div className="text-center fade-in">
        <h2 className="text-3xl font-bold mb-4 text-indigo-800 dark:text-indigo-200">IQ Test</h2>
        <button onClick={startTest} className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-105">
          Start Test
        </button>
      </div>
    );
  }

  if (testCompleted) {
    return (
      <div className="text-center fade-in">
        <h3 className="text-2xl font-bold mb-4 text-indigo-800 dark:text-indigo-200">Test Completed!</h3>
        <p className="text-xl mb-4 text-indigo-800 dark:text-indigo-200">Your IQ score: {score}</p>
        <button onClick={finishTest} className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-105">
          Continue to Story Generator
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto fade-in">
      <h2 className="text-3xl font-bold mb-4 text-center text-indigo-800 dark:text-indigo-200">IQ Test</h2>
      
      {/* Render the current question */}
      <p className="text-xl mb-4 text-center text-indigo-800 dark:text-indigo-200">
        {iqQuestions[currentQuestion].question}
      </p>
      
      <div className="flex flex-col items-center space-y-2">
        {iqQuestions[currentQuestion].options.map((option, index) => (
          <button 
            key={index}
            onClick={() => selectAnswer(index)} 
            className={`w-full max-w-md px-4 py-2 text-left rounded-lg transition-all duration-300 ${
              selectedAnswer === index 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-gray-700'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      
      {selectedAnswer !== null && (
        <button 
          onClick={nextQuestion} 
          className="mt-4 block mx-auto bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-105"
        >
          {currentQuestion < iqQuestions.length - 1 ? 'Next' : 'Finish Test'}
        </button>
      )}
    </div>
  );
}

IQTest.propTypes = {
  completeIQTest: PropTypes.func.isRequired,
  changePage: PropTypes.func.isRequired
};

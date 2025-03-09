import { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for HTTP requests
import sentencesData from './sentences.json';
import Leaderboard from './components/Leaderboard';
import { auth, loginWithGoogle, logout } from '../firebase-config'; // Import from firebase-config
import './index.css';

const getRandomSentence = () => {
  const index = Math.floor(Math.random() * sentencesData.length);
  return sentencesData[index];
};

const App = () => {
  const [sentence, setSentence] = useState(getRandomSentence());
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [name, setName] = useState('');
  const [user, setUser] = useState(null); // Store current user

  // Fetch leaderboard data when the component mounts
  useEffect(() => {
    const fetchLeaderboard = async () => {
      const backendUrl = process.env.VITE_BACKEND_URI;
      try {
        const response = await axios.get(`${backendUrl}/api/leaderboard`);
        setLeaderboard(response.data);
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
      }
    };
    fetchLeaderboard();
  }, []);

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(setUser);
    return unsubscribe;

  }, []);

  // Update WPM and save score when input matches sentence
  useEffect(() => {
    if (input === sentence) {
      const endTime = new Date().getTime();
      const timeTaken = (endTime - startTime) / 1000 / 60; // Time in minutes
      const words = sentence.split(' ').length;
      const finalWpm = (words / timeTaken).toFixed(2);
      setWpm(finalWpm);
      saveScore(user?.displayName || name, finalWpm);
    }
  }, [input, sentence, startTime, user, name]);

  // Handle input changes and track start time
  const handleChange = (e) => {
    if (!startTime) {
      setStartTime(new Date().getTime());
    }
    setInput(e.target.value);
  };

  // Handle restart of the typing game
  const handleRestart = () => {
    setSentence(getRandomSentence());
    setInput('');
    setStartTime(null);
    setWpm(0);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Highlight the sentence based on correct/incorrect typing
  const getHighlightedSentence = () => {
    const sentenceWords = sentence.split(' ');
    const inputWords = input.split(' ');

    return sentenceWords.map((word, index) => {
      const inputWord = inputWords[index] || '';
      const isCorrect = word === inputWord;
      return (
        <span key={index} className={`${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
          {word}
          {index < sentenceWords.length - 1 ? ' ' : ''}
        </span>
      );
    });
  };

  // Save score to backend and update leaderboard
  const saveScore = async (name, score) => {
    if (name.trim()) {
      const newScore = { name, score: parseFloat(score) };

      try {
        // Send POST request to save the score
        await axios.post('https://wordracer-back.vercel.app/api/leaderboard', newScore);

        // After saving, fetch the updated leaderboard
        const response = await axios.get('https://wordracer-back.vercel.app/api/leaderboard');
        setLeaderboard(response.data);
      } catch (error) {
        console.error("Error saving score:", error);
      }
    }
  };

  // Handle user login with Firebase
  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error("Login error: ", error);
    }
  };

  // Handle user logout
  const handleLogout = () => {
    logout().catch((error) => {
      console.error("Logout error: ", error);
    });
  };

  return (
    <div className={`${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'} flex min-h-screen`}>
      <div className="flex-grow flex flex-col items-center justify-center p-8">
        {/* Dark Mode Toggle */}
        <div className="absolute top-4 right-4">
          <button
            onClick={toggleDarkMode}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-700 transition duration-300"
          >
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>

        <h1 className="text-4xl font-bold mb-8">Type Fast Buddy</h1>

        {/* Login / Logout Button */}
        {!user ? (
          <button
            onClick={handleLogin}
            className="px-4 py-2 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-700 transition duration-300 mb-8"
          >
            Login with Google
          </button>
        ) : (
          <div className="mb-8">
            <p className="text-lg">Welcome, {user.displayName}!</p>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-700 transition duration-300"
            >
              Logout
            </button>
          </div>
        )}

        {/* Typing Area */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md rounded-lg p-8 mb-4 w-full max-w-lg`}>
          <p className="text-lg font-mono mb-4 break-words">{getHighlightedSentence()}</p>
          <textarea
            value={input}
            onChange={handleChange}
            placeholder="Start typing..."
            className={`w-full h-24 p-4 border ${darkMode ? 'border-gray-600 bg-gray-700 text-gray-100' : 'border-gray-300 bg-white text-gray-900'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {wpm > 0 && <p className="mt-4 text-xl text-green-400">Your WPM: {wpm}</p>}
        </div>

        {/* Restart Button */}
        <button
          onClick={handleRestart}
          className={`px-4 py-2 ${darkMode ? 'bg-green-500' : 'bg-blue-500'} text-white rounded-lg shadow-lg hover:${darkMode ? 'bg-green-700' : 'bg-blue-700'} transition duration-300`}
        >
          Restart
        </button>

        {/* Name Input (for non-logged-in users) */}
        {!user && (
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className={`mt-4 w-full p-2 border ${darkMode ? 'border-gray-600 bg-gray-700 text-gray-100' : 'border-gray-300 bg-white text-gray-900'} rounded-lg`}
          />
        )}
      </div>

      {/* Leaderboard */}
      <div className="w-80 p-8">
        <Leaderboard scores={leaderboard} />
      </div>
    </div>
  );
};

export default App;

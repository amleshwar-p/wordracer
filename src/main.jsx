// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';  // Use this import for React 18

import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));  // Use createRoot here
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
